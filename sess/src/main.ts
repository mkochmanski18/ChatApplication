import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeormStore } from 'connect-typeorm/out';
import { Session } from './auth/session.entity';
import { getConnection, getRepository } from 'typeorm';
import { WebSocketAdapter } from './gateway/gataway.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionRepository = getRepository(Session);
  const adapter = new WebSocketAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.use(cookieParser());
  app.enableCors({origin:['http://localhost:3000'],credentials:true});
  app.use(session({
    name:"CHAT_SESSION_ID",
    secret:"asdhjhk234",
    resave:false,
    saveUninitialized:false,
    cookie:{
      maxAge:86400000,
      sameSite:false,
    },
    store: new TypeormStore().connect(sessionRepository),
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  
  const config = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('description')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
    
  await app.listen(5000);

  
}
bootstrap();
