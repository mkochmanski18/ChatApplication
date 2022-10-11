import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConversationModule } from './conversation/conversation.module';
import { FriendModule } from './friend/friend.module';
import { GatewayModule } from './gateway/gateway.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    FriendModule,
    MessageModule,
    ConversationModule,
    AdminModule,
    GatewayModule,
    EventEmitterModule.forRoot(),
    PassportModule.register({
      session:true,
    }),
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'localhost',
      port:3306,
      username:'root',
      password:'',
      database:"charliedb",
      entities:["dist/**/**.entity{.ts,.js}"],
      bigNumberStrings: false,
      logging: false,
      synchronize: true
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
