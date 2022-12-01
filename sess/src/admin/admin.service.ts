import { Injectable } from "@nestjs/common";
import { Conversation } from "src/conversation/conversation.entity";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { MessagesQueryTypeEnum } from "src/utils/types";
import { getManager, getRepository } from "typeorm";

@Injectable()
export class AdminService {
    
    constructor(private readonly userService: UserService) {}

    getUsers(){
        const users = User.query('select userid,name,firstname,lastname,sex,email,confirmed,role,photo from user group by role,confirmed');
        return users;
    }

    async getRegistrationsCounter(range:string){
        if(range === '0') return await User.query('select SUBSTRING(createdAt,1,10) as okres,count(userd) as liczba from user group by createdAt');
        else if(range === '1' ) return await User.query('select SUBSTRING(createdAt,1,7) as okres,count(userd) as liczba from user group by okres');
        else if(range === '2') return await User.query('select SUBSTRING(createdAt,1,4) as okres,count(userd) as liczba from user group by okres');
        else return [];
    }

    getNamedConversations() {
        const conversations = Conversation.query('select * from conversation group by conversationType');
        return conversations;
      }

    async getConversationsCounter(range:string){
        if(range === '0') return await Conversation.query('select SUBSTRING(createdAt,1,10) as okres,count(conversationId) as liczba from conversation group by createdAt');
        else if(range === '1' ) return await Conversation.query('select SUBSTRING(createdAt,1,7) as okres,count(conversationId) as liczba from conversation group by okres');
        else if(range === '2') return await Conversation.query('select SUBSTRING(createdAt,1,4) as okres,count(conversationId) as liczba from conversation group by okres');
        else return [];
    }

    async getMessagesCounter(range:string){
        //return await Message.query('select SUBSTRING(date,1,5) as "okres" from message group by date');
        if(range === '0') return await Message.query('select date as okres,count(messageId) as liczba from message group by date order by okres');
        if(range === '1') return await Message.query('select SUBSTRING(date,4,8) as okres,count(messageId) as liczba from message group by okres order by okres');
        if(range === '2') return await Message.query('select SUBSTRING(date,7,4) as okres,count(messageId) as liczba from message group by okres order by okres');
        else return [];
    }
    }
