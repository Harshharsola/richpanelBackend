import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Controller('conversations')
export class ConversationsController {
  constructor(
    private conversationsService: ConversationsService,
    private chatGateway: ChatGateway,
  ) {}
  @Get('messaging-webhook')
  async messengerWebhook(@Req() req, @Res() res) {
    console.log('hi');
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
    if (mode && token) {
      if (mode === 'subscribe' && token === 'verification') {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }

  @Post('messaging-webhook')
  async webhook(@Body() body, @Res() res) {
    if (body.object === 'page') {
      const response = await this.conversationsService.addMessageToDb(
        body.entry[0],
      );

      const msgSent = await this.conversationsService.sendMsgToUser(
        body.entry[0],
      );
      // console.log(body.entry[0]);
      res.status(200).send(response);
    } else {
      res.sendStatus(404);
    }
  }

  @Get('connect-page')
  async connectPage(@Res() res) {
    const response = await this.conversationsService.connectPageToWebhook(res);
    // res.status(200).send(response);
    return 'success';
  }

  @Get()
  async getConversation(@Query('pageId') pageId, @Res() res) {
    console.log('page id ', pageId);
    const response = await this.conversationsService.getConversation(pageId);
    res.status(200).send(response);
  }
}
