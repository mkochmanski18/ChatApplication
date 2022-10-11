import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TypeormStore } from 'typeorm-store';
import { Session } from './auth/session.entity';
import { getConnection } from 'typeorm';
import { WebSocketAdapter } from './gateway/gataway.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const repository = getConnection().getRepository(Session);
  const adapter = new WebSocketAdapter(app);
  app.useWebSocketAdapter(adapter);
  app.use(cookieParser());
  app.use(session({
    name:"CHAT_SESSION_ID",
    secret:"asdhjhk234",
    resave:false,
    saveUninitialized:false,
    cookie:{
      maxAge:86400000,
    },
    store: new TypeormStore({repository})
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
    
  await app.listen(3000);

  
}
bootstrap();
