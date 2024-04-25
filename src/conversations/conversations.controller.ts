import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}
  @Get('messaging-webhook')
  async messengerWebhook(@Req() req, @Res() res) {
    console.log('hi');
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
      // Check the mode and token sent is correct
      if (mode === 'subscribe' && token === 'verification') {
        // Respond with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        // Respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  }

  @Post('messaging-webhook')
  async webhook(@Body() body, @Res() res) {
    if (body.object === 'page') {
      // Returns a '200 OK' response to all requests
      const response = await this.conversationsService.addMessageToDb(
        body.entry[0],
      );

      res.status(200).send(response);
    } else {
      // Return a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  }

  @Get('connect-page')
  async connectPage(@Res() res) {
    const response = await this.conversationsService.connectPageToWebhook(res);
    res.status(200).send(response);
  }
}
