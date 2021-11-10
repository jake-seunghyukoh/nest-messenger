import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import {
  BaseWsExceptionFilter,
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { Socket } from 'dgram';

@UseGuards(LocalAuthGuard)
@UsePipes(new ValidationPipe())
@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway()
export class MessagesGateway {
  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ): WsResponse<unknown> {
    console.log(client, data);

    const event = 'message';
    return { event, data };
  }
}
