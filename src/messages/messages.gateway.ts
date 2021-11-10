import { Logger, UseFilters } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  BaseWsExceptionFilter,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Socket } from 'socket.io';
import { Server } from 'ws';

@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway()
export class MessagesGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private logger: Logger = new Logger('MessageGateway');

  public afterInit(): void {
    this.logger.log('Init');
  }

  public handleConnection(client: Socket): void {
    this.logger.log(`Connected: ${client.id}`);
  }

  public handleDisconnect(client: Socket): void {
    this.logger.log(`Disconnected: ${client.id}`);
  }
}
