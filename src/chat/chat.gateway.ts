import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}
  private readonly logger = new Logger(ChatGateway.name);
  private users = new Map<string, string>();
  @WebSocketServer() io: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.log(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }

  @SubscribeMessage('ping')
  handleMessage(
    client: any,
    data: {
      conversationId: string;
      pageId: string;
      recipientId: string;
      message: string;
    },
  ) {
    this.logger.log(`Message received from client id: ${client.id}`);
    this.logger.debug(`Payload: ${data}`);
    // this.chatService.sendMsgToRecipient(data);
    //add msg to data base and send msg to facebook
  }

  @SubscribeMessage('identify')
  handleIdentify(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: string,
  ): void {
    this.users.set(userId, client.id);
    this.logger.log(`User ${userId} connected with socket ${client.id}`);
  }
  notifyUser(userId: string, data: any): void {
    const socketId = this.users.get(userId);
    if (socketId) {
      this.io.to(socketId).emit('pong', data);
      this.logger.log(
        `Notified user ${userId} with data ${JSON.stringify(data)}`,
      );
    } else {
      this.logger.log(`User ${userId} not connected`);
    }
  }
}
