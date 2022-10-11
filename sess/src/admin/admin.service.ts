import { Injectable } from "@nestjs/common";
import { Conversation } from "src/conversation/conversation.entity";
import { Message } from "src/message/message.entity";
import { UserService } from "src/user/user.service";
import { MessagesQueryTypeEnum } from "src/utils/types";
import { getManager, getRepository } from "typeorm";

@Injectable()
export class AdminService {
    
    constructor(private readonly userService: UserService) {}

    getUsers(){
        const users = this.userService.getUsers();
        return users;
    }

    getNamedConversations() {
        const conversations = Conversation.query('select * from conversation where name is not $1',['Regular Conversation']);
        return conversations;
      }

    async getMessages(){
        const res = await Message.query('select date,count(messageId) from message group by date');
        return res;
    }
    }
