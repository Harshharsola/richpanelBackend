import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FacebookService } from 'src/facebook/facebook.service';
import { Message } from 'src/schemas/messages.schema';
import { Page } from 'src/schemas/pages.schema';
import { User } from 'src/schemas/users.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private msgModel: Model<Message>,
    @InjectModel(Page.name) private pageModel: Model<Page>,
    private facebookService: FacebookService,
  ) {}
  async sendMsgToRecipient(body: {
    conversationId: string;
    pageId: string;
    recipientId: string;
    message: string;
  }) {
    const createdMsg = new this.msgModel({
      conversationId: body.conversationId,
      messageContent: body.message,
      senderId: body.pageId,
    });
    createdMsg.save();
    const page = await this.pageModel.findOne({
      fbPageId: body.pageId,
    });
    this.facebookService.sendResponseToUser({
      pageId: body.pageId,
      recipientId: body.recipientId,
      message: body.message,
      pageAccessToken: page.pageAccessToken,
    });
  }
}
