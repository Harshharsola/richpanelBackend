import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FacebookService } from 'src/facebook/facebook.service';
import { Conversation } from 'src/schemas/conversations.schema';
import { Message } from 'src/schemas/messages.schema';
import { Page } from 'src/schemas/pages.schema';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private msgModel: Model<Message>,
    @InjectModel(Page.name) private pageModel: Model<Page>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private facebookService: FacebookService,
  ) {}
  async sendMsgToRecipient(body: {
    conversationId: string;
    pageId: string;
    recipientId: string;
    message: string;
  }) {
    const conversation = await this.conversationModel.findOne({
      fbConvoId: body.conversationId,
    });
    const createdMsg = new this.msgModel({
      conversationId: conversation._id,
      messageContent: body.message,
      senderId: body.pageId,
      timeStamp: Date.now(),
    });
    createdMsg.save();
    const page = await this.pageModel.findById(body.pageId);
    this.facebookService.sendResponseToUser({
      pageId: page.fbPageId,
      recipientId: body.recipientId,
      message: body.message,
      pageAccessToken: page.pageAccessToken,
    });
  }
}
