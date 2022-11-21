import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Conversation } from 'src/conversation/conversation.entity';
import { userData } from 'src/utils/interfaces';
import { User } from 'src/user/user.entity';
import { ConfirmationStatusEnum, ConversationTypeEnum, RelationshipType } from 'src/utils/types';
import { getRepository } from 'typeorm';
import { Friend } from './friend.entity';

@Injectable()
export class FriendService {
    constructor(private eventEmitter: EventEmitter2){}
    
    async inviteUser(userid: string, friendid:string): Promise<HttpException> {
        const user = await User.findOne({userid});
        if(!user)
            throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND);

        const friend = await User.findOne({userid:friendid});
        if(!friend)
            throw new HttpException("Friend doesn't exist",HttpStatus.NOT_FOUND);
        if(!friend.confirmed)
            throw new HttpException("Friend doesn't confirmed email yet",HttpStatus.NOT_ACCEPTABLE);
        const relation = new Friend();
        relation.confirmatonStatus = ConfirmationStatusEnum.REMAINING;
        relation.user = user;
        relation.friend = friend;
        relation.save();
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] invited User: "+friend.name+"["+friend.email+"]"+" to friends list!");
        this.eventEmitter.emit('inviting.create',friend);
        throw new HttpException("Invitation sended",HttpStatus.CREATED);
    }

    async confirmInvitation(userid: string, friendid:string): Promise<HttpException> {
        const user = await User.findOne({userid});
        if(!user)
            throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND);

        const friend = await User.findOne({userid:friendid});
        if(!friend)
            throw new HttpException("Friend doesn't exist",HttpStatus.NOT_FOUND);
        const relation = await Friend.findOne({user:friend, friend:user});
        if(!relation)
            throw new HttpException("Invitation doesn't exist",HttpStatus.NOT_FOUND);

        relation.confirmatonStatus = ConfirmationStatusEnum.CONFIRMED;
        const result = await relation.save();
        if(!result) throw new HttpException("Invitation doesn't exist",HttpStatus.NOT_FOUND);
        
        const conversation = new Conversation();
        conversation.creator = friend;
        conversation.createdAt = new Date();
        conversation.conversationType = ConversationTypeEnum.REGULAR;
        conversation.name = "Regular Conversation";
        
        conversation.participants = [user, friend];
        conversation.save();

        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] confirmed relation with User: "+friend.name+"["+friend.email+"]"+"!");
        this.eventEmitter.emit('friend.update',{user,friend});
        throw new HttpException("Invitation confirmed",HttpStatus.OK);
    }

    async rejectInvitation(userid: string, friendid:string): Promise<HttpException> {
        const user = await User.findOne({userid});
        if(!user)
            throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND);

        const friend = await User.findOne({userid:friendid});
        if(!friend)
            throw new HttpException("Friend doesn't exist",HttpStatus.NOT_FOUND);
        const relation = await Friend.findOne({user:friend, friend:user});
        if(!relation)
            throw new HttpException("Invitation doesn't exist",HttpStatus.NOT_FOUND);

        relation.confirmatonStatus = ConfirmationStatusEnum.REJECTED;
        const result = await relation.save();
        if(!result) throw new HttpException("Invitation doesn't exist",HttpStatus.NOT_FOUND);

        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] rejected relation with User: "+friend.name+"["+friend.email+"]"+"!");
        this.eventEmitter.emit('friend.update',{user,friend});
        throw new HttpException("Invitation rejected",HttpStatus.OK);
    }

    async getInvitations(userid: string): Promise<HttpException|userData[]> {
        const user = await User.findOne({userid});
        if(!user)
            throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND);

            const invitations = await getRepository(User)
            .createQueryBuilder("user")
            .select("user.userid,user.firstname,user.lastname,user.name,user.sex,user.email")
            .leftJoin("user.users","friend")
            .where("friend.confirmatonStatus=:status AND friend.friendUserid=:id",{status:ConfirmationStatusEnum.REMAINING,id:user.userid})
            .orderBy({
              "user.name": "ASC",
            })
            .getRawMany();
        return invitations;
    }

    async getRejectedUsers(userid: string): Promise<HttpException|userData[]> {
        const user = await User.findOne({userid});
        if(!user)
            throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND);

            const invitations = await getRepository(User)
            .createQueryBuilder("user")
            .select("user.userid,user.firstname,user.lastname,user.name,user.sex,user.email")
            .leftJoin("user.users","friend")
            .where("friend.confirmatonStatus=:status AND friend.friendUserid=:id",{status:2,id:user.userid})
            .orderBy({
              "user.name": "ASC",
            })
            .getRawMany();
        return invitations;
    }

    async isFriend(userid: string, friendid: string): Promise<RelationshipType | HttpException> {
        const user = await getRepository(Friend)
        .createQueryBuilder("friend")
        .select("friend.confirmatonStatus,user.userid,user.name,user.sex,user.email")
        .leftJoin("friend.friend","user")
        .where("friend.userUserid=:id AND friend.friendUserid=:fid",{id:userid,fid:friendid})
        .orWhere("friend.friendUserid=:id AND friend.userUserid=:fid",{id:userid,fid:friendid})
        .getRawOne();
        console.log(user.confirmatonStatus)
        if(!user) return RelationshipType.FOREIGN;
        else return user.confirmatonStatus;
    }

    async getFriendList(userid: string): Promise<userData[]> {
        const user = await User.findOne({userid});
        if(!user)
            throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND);
        
        const flist = await getRepository(Friend)
            .createQueryBuilder("friend")
            .select("user.userid,user.firstname,user.lastname,user.name,user.sex,user.email")
            .leftJoin("friend.friend","user")
            .where("friend.confirmatonStatus=:status AND friend.userUserid=:id",{status:1,id:user.userid})
            .orWhere("friend.confirmatonStatus=:status AND friend.friendUserid=:id",{status:1,id:user.userid})
            .orderBy({
              "friend.friendUserid": "ASC",
            })
            .getRawMany();
            
        return flist;
    }

    async deleteFriend(userid:string,friendid:string):Promise<HttpException> {
        const user = await User.findOne({userid});
        if(!user)
            throw new HttpException("User Account doesn't exist",HttpStatus.NOT_FOUND);
        const friend = await User.findOne({userid:friendid});
        if(!friend)
            throw new HttpException("Friend Account doesn't exist",HttpStatus.NOT_FOUND);
        const relation = await Friend.findOne({user,friend});
        Friend.delete(relation);

        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] deleted User: "+friend.name+"["+friend.email+"]"+" from friends list!");
        this.eventEmitter.emit('friend.update',[user,friend]);
        throw new HttpException("User deleted from list",HttpStatus.OK);
    }
}