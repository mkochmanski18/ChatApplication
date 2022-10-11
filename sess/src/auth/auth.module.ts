import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './localStrategy';
import { SessionSerializer } from './sessionSerializer';

@Module({
  imports:[
    TypeOrmModule.forFeature([User])
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    SessionSerializer
    ]
})
export class AuthModule {}
