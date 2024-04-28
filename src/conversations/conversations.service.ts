import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatGateway } from 'src/chat/chat.gateway';
import { FacebookService } from 'src/facebook/facebook.service';
import { Conversation } from 'src/schemas/conversations.schema';
import { Message } from 'src/schemas/messages.schema';
import { Page, PagesDocument } from 'src/schemas/pages.schema';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class ConversationsService {
  constructor(
    private chatGateway: ChatGateway,
    @InjectModel(Message.name) private msgModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Page.name) private pageModel: Model<Page>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private facebookService: FacebookService,
  ) {}

  async connectPageToWebhook(res: any) {
    const data = await this.fetchAccessToken();
    try {
      const response = await fetch(
        `https://graph.facebook.com/${process.env.APP_ID}/subscriptions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            object: 'page',
            callback_url:
              'https://42d9-2405-201-4018-a2b9-99da-e35-f284-7d0f.ngrok-free.app/conversations/messaging-webhook',
            fields: 'messages',
            verify_token: 'verification',
            access_token: data.access_token,
          }),
        },
      );
      console.log(response);
      res.status(200).send(response);
    } catch (error) {
      console.log(error);
    }
  }

  async fetchAccessToken() {
    const url = new URL('https://graph.facebook.com/oauth/access_token');

    // Adding parameters to the URL
    url.searchParams.append('client_id', process.env.APP_ID); // Replace 'your-app-id' with your actual Facebook App ID
    url.searchParams.append('client_secret', process.env.APP_SECRET); // Replace 'your-app-secret' with your actual Facebook App Secret
    url.searchParams.append('grant_type', 'client_credentials');

    try {
      const response = await fetch(url, {
        method: 'GET', // This is optional as GET is the default method
      });
      const data = await response.json(); // Parsing the JSON response body
      console.log('Access Token:', data);
      return data;
    } catch (error) {
      console.error('Error fetching access token:', error);
    }
  }

  async addMessageToDb(msgObjectFromFb) {
    try {
      const currentTime = Date.now();
      const oneDayAgo = currentTime - 24 * 60 * 60 * 1000;
      const conversation = await this.conversationModel.find(
        { senderId: msgObjectFromFb.messaging[0].sender.id },
        { sort: { timeStamp: -1 }, limit: 1 },
      );

      let conversationId;
      if (
        conversation.length &&
        conversation[0].timeStamp &&
        conversation[0].timeStamp.getTime() < oneDayAgo
      ) {
        const newConversation = new this.conversationModel({
          userId: msgObjectFromFb.id,
          senderId: msgObjectFromFb.messaging[0].sender.id,

          timeStamp: currentTime,
        });
        conversationId = (await newConversation.save())._id;
      } else if (conversation.length) {
        await this.conversationModel.findOneAndUpdate(
          { _id: conversation[0]._id },
          { timeStamp: currentTime },
        );
        conversationId = conversation[0]._id;
      } else {
        const newConversation = new this.conversationModel({
          userId: msgObjectFromFb.id,
          senderId: msgObjectFromFb.messaging[0].sender.id,
          timeStamp: currentTime,
        });
        conversationId = (await newConversation.save())._id;
      }

      const msg = {
        senderId: msgObjectFromFb.messaging[0].sender.id,
        conversationId,
        messageContent: msgObjectFromFb.messaging[0].message.text,
        timeStamp: msgObjectFromFb.time,
      };
      const createdMsg = new this.msgModel(msg);
      return await createdMsg.save();
    } catch (error) {
      console.error('Failed to add message to DB:', error);
      throw error; // Rethrow or handle as needed
    }
  }
  async sendMsgToUser(msgObjectFromFb: any) {
    console.log(msgObjectFromFb.id);
    try {
      const page = await this.pageModel.findOne({
        fbPageId: msgObjectFromFb.id,
      });
      const user = await this.userModel.findById(page.userId);
      const msgObject = {
        senderId: msgObjectFromFb.messaging[0].sender.id,
        messageContent: msgObjectFromFb.messaging[0].message.text,
      };
      this.chatGateway.notifyUser(user._id.toString(), msgObject);
      return 'success';
    } catch (error) {
      console.log(error);
    }
    return 'fail';
  }

  async getConversation(pageId: string) {
    const page = await this.pageModel.findById(pageId);
    let response;
    try {
      response = await this.facebookService.getConversations(
        page.fbPageId,
        page.pageAccessToken,
      );

      response.data.forEach((conversation) => {
        const createdConversation = new this.conversationModel({
          userId: page.fbPageId,

          senderId: conversation.participants.data[0].id,

          fbConvoId: conversation.id,
          timeStamp: Date.now(),
        });
        createdConversation.save();
      });
    } catch (error) {
      console.log(error);
    }

    return { data: response.data };
    // if (body.conversationId) {
    //   response = await this.msgModel.find(
    //     { conversationId: body.conversationId },
    //     { sort: { timeStamp: -1 } },
    //   );
    //   return response;
    // } else if (body.userId) {
    //   let user: User = await this.userModel.findOne({ _id: body.userId });
    //   response = await this.conversationModel.find({ userId: user.userFbId });
    //   return response;
    // }
    // response = 'missing params';
    // return response;
  }
}
