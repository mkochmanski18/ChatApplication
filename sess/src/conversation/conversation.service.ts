import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { Message } from 'src/message/message.entity';
import { User } from 'src/user/user.entity';
import { ConversationTypeEnum } from 'src/utils/types';
import { getManager, getRepository } from 'typeorm';
import { Conversation } from './conversation.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConversationDto } from './dto/conversation.dto';
import { FriendService } from 'src/friend/friend.service';

@Injectable()
export class ConversationService {
  constructor(
    private eventEmitter: EventEmitter2,
    private friendService: FriendService
    ){}

    async changeName(conversationid: string, newname: string): Promise<HttpException> {
        const conversation = await Conversation.findOne(conversationid);
        if(!conversation) throw new HttpException("Conversation doesn't exist",HttpStatus.NOT_FOUND);

        const oldname = conversation.name;
        conversation.name = newname;
        conversation.save();

        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - Conversation: "+ oldname+" changed name to "+newname+"!");
        this.eventEmitter.emit('conversation.update',conversation);
        throw new HttpException("Conversation's name changed",HttpStatus.OK);
    }

    async changeOwner(conversationid: string, userid: string): Promise<HttpException> {
        const conversation = await Conversation.findOne(conversationid);
        if(!conversation) throw new HttpException("Conversation doesn't exist",HttpStatus.NOT_FOUND);

        const user = await User.findOne({userid});
        if(!user) throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND);

        const oldowner = conversation.creator;
        conversation.creator = user;
        conversation.save();

        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - Conversation: "+ oldowner+" changed owner to "+userid+"!");
        this.eventEmitter.emit('conversation.update',conversation);
        throw new HttpException("Conversation's owner changed",HttpStatus.OK);
    }
    
    async deleteConversation(conversationid: string): Promise<HttpException> {
        const conversation = await Conversation.findOne(conversationid);
        if(!conversation) throw new HttpException("Conversation doesn't existt",HttpStatus.NOT_FOUND);
        if(conversation.conversationType = ConversationTypeEnum.REGULAR) throw new HttpException("Conversation can't be deleted!",HttpStatus.FORBIDDEN);
        Conversation.delete({conversationId:conversationid})

        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - Conversation: "+ conversation.name+" has been deleted!");
        this.eventEmitter.emit('conversation.delete',conversation.conversationId);
        throw new HttpException("Conversation deleted",HttpStatus.OK);
    }

    async createConversation(body: ConversationDto): Promise<HttpException | Conversation> {
        const owner = await User.findOne({userid:body.ownerID});
        if(!owner) throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND);
        const conversation = new Conversation();
        conversation.creator = owner;
        conversation.createdAt = new Date();
        conversation.name = body.name;
        conversation.conversationType = ConversationTypeEnum.GROUP;
        conversation.participants = [owner];
        await conversation.save();
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - Conversation: name: "+conversation.name+" has been created!");
        
        const conversationObject = await getRepository(Conversation)
            .createQueryBuilder("conversation")
            .leftJoinAndSelect("conversation.participants", "conv")
            .where("conversation.name=:name",{name:conversation.name})
            .getOne()
        console.log(conversationObject)
        this.eventEmitter.emit('conversation.create',conversationObject);
        return conversation;
    }

    async getUserConversations(userid:string): Promise<HttpException|User[]|Conversation[]>{
        const user = User.findOne({userid});
        if(!user) throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND);

        const query = await User.createQueryBuilder("user")
        .leftJoinAndSelect("user.conversations","conv")
        .leftJoinAndSelect("conv.participants","participant")
        .where("user.userid=:id",{id:userid})
        .getOne();
        let newConversationsArray = [];
        if(query){
        const {conversations} = query;
        conversations.map(conv=>{
            const {conversationId,name,createdAt,conversationType,participants}=conv;
            let newParticipantsArray = [];
            participants.map(participant=>{
                const {userid,name,firstname,lastname,email,photo} = participant;
                newParticipantsArray.push({userid,name,firstname,lastname,email,photo});
            });
            newConversationsArray.push({conversationId,name,createdAt,conversationType,newParticipantsArray});
        })
    }
        return newConversationsArray;
    }
    
    async getMessages(conversationid: string): Promise<HttpException|Message[]> {
        const conversation = await Conversation.findOne({conversationId:conversationid});
        if(!conversation) throw new HttpException("Conversation doesn't exist",HttpStatus.NOT_FOUND);
        
        const messages = await Message.createQueryBuilder("message")
        .leftJoinAndSelect("message.sender","sender")
        .leftJoinAndSelect("message.conversation","conversation")
        .where("conversation.conversationId=:id",{id:conversation.conversationId})
        .orderBy("message.datetime","ASC")
        .getMany();
        console.log(messages)
        let newMessagesArray=[];
        messages.map(message=>{
            const {messageId,date,datetime,content,messageType,sender,conversation}=message;
            
            
            const {userid,name,firstname,lastname,email,photo} = sender;
            let senderData = ({userid,name,firstname,lastname,email,photo});
            
            newMessagesArray.push({messageId,date,datetime,content,messageType,senderData,conversation});
        })
        return newMessagesArray;
    }
    
    async getParticipants(conversationid: string): Promise<HttpException|Conversation> {
        const result = await this.getConversation(conversationid);
        if(!result) throw new HttpException("Conversation doesn't exist",HttpStatus.NOT_FOUND);
        return result;
    }
    
    async getConversation(conversationid: string): Promise<Conversation> {
        const result = await getRepository(Conversation)
            .createQueryBuilder("conversation")
            .leftJoinAndSelect("conversation.participants", "conv")
            .where("conversationId=:id",{id:conversationid})
            .getOne()
            return result;
    }

    async addParticipant(conversationid: string, participantid:string): Promise<HttpException>{
        const conversation = await this.getConversation(conversationid);
        if(!conversation) throw new HttpException("Conversation doesn't exist",HttpStatus.NOT_FOUND);
        const user = await User.findOne({userid:participantid});
        if(!user) throw new HttpException("Participant doesn't exist",HttpStatus.NOT_FOUND);

        conversation.participants.push(user);
        conversation.save();

        this.eventEmitter.emit('conversation.update',conversation);
        throw new HttpException("Participant has been added to conversation",HttpStatus.OK);
    }

    async deleteParticipant(conversationid: string, participantid:string): Promise<HttpException>{
        const conversation = await Conversation.findOne({conversationId:conversationid});
        if(!conversation) throw new HttpException("Conversation doesn't exist",HttpStatus.NOT_FOUND);

        const user = await User.findOne({userid:participantid});
        if(!user) throw new HttpException("Participant doesn't exist",HttpStatus.NOT_FOUND);

        let newArray = [];
        conversation.participants.forEach(participant=>{
            if(participant!==user) newArray.push(participant);
        })
        conversation.participants = newArray;
        conversation.save();

        this.eventEmitter.emit('conversation.update',conversation);
        throw new HttpException("Participant has been deleted from conversation",HttpStatus.OK);
    }

}