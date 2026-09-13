import { Module } from '@nestjs/common';
import { SignalingGateway } from './signaling.gateway';
import { CallsModule } from '../calls/calls.module';
import { MessagesModule } from '../messages/messages.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CallsModule, MessagesModule, UsersModule],
  providers: [SignalingGateway],
  exports: [SignalingGateway],
})
export class SignalingModule {}
