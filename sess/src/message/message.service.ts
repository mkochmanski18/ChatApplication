import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { getRepository } from 'typeorm';
import { MessageDto } from './dto/message.dto';
import { Message } from './message.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Conversation } from 'src/conversation/conversation.entity';
import { MessageTypeEnum } from 'src/utils/types';

@Injectable()
export class MessageService {
  constructor(private eventEmitter: EventEmitter2){}

    async sendTextMessage(data:MessageDto): Promise<HttpException> {
        const user = await User.findOne({userid:data.senderId});
        if(!user) throw new HttpException("Sender User id is incorrect",HttpStatus.BAD_REQUEST)
        
        const conversation = await Conversation.findOne({conversationId:data.conversationId});
        if(!conversation) throw new HttpException("Conversation doesn't exist",HttpStatus.BAD_REQUEST)

        let message = new Message;
        message.date = new Date(data.datetime).toISOString().split('T')[0];
        message.datetime = new Date(data.datetime);
        message.sender = user;
        message.content = data.text;
        message.conversation = conversation;
        message.messageType = MessageTypeEnum.TEXT;
        message.save()

        const {messageId,date,datetime,content,messageType,sender}=message;
        const {userid,name,firstname,lastname,email,photo} = sender;
        let senderData = ({userid,name,firstname,lastname,email,photo});
        const newMessages = {messageId,date,datetime,content,messageType,senderData,conversation};
        
        this.eventEmitter.emit('message.create',newMessages);
        throw new HttpException({msg:"Message sended",data},HttpStatus.CREATED);
    }

    async sendImageMessage(userid:string,conversationid:string,file:Express.Multer.File): Promise<HttpException> {
      const user = await User.findOne({userid});
      if(!user) throw new HttpException("Sender User id is incorrect",HttpStatus.BAD_REQUEST)
      
      const conversation = await Conversation.findOne({conversationId:conversationid});
      if(!conversation) throw new HttpException("Conversation doesn't exist",HttpStatus.BAD_REQUEST)

      let message = new Message;
      const data = new Date();
      message.date = data.toDateString().split('-14')[0];
      message.datetime = data;
      message.sender = user;
      message.conversation = conversation;
      message.content = file.filename;
      message.messageType = MessageTypeEnum.IMAGE;
      message.save()
      
      this.eventEmitter.emit('message.create',message);
      throw new HttpException({msg:"Message sended",data},HttpStatus.CREATED);
  }

    async getMessages(userid:string): Promise<HttpException|MessageDto[]> {
        const user = await User.findOne({userid});
        if(!user) throw new HttpException("Sender User ID is incorrect",HttpStatus.BAD_REQUEST);
        
        const messages = await getRepository(Message)
        .createQueryBuilder("message")
        .select("messageid,datetime,senderUserid,conversationConversationId,content")
        .where("senderUserid=:uid",{uid:user.userid})
        .getRawMany();
        return messages;
        }

    async getImageMessage(messageId:string,res:any): Promise<HttpException|MessageDto[]> {
        const message = await Message.findOne({messageId});
        if(!message) throw new HttpException("Message ID is incorrect",HttpStatus.BAD_REQUEST);
        
        return res.sendFile(message.content, { root: './assets/messages' });
        }
}
