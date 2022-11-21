import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { Observable } from 'rxjs';
import { UserRoleEnum } from "src/utils/types";
import { Conversation } from 'src/conversation/conversation.entity';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
      
      // const user = await User.findOne({userid:req.user.userid})
      // console.log(user,req.sessionID)
      // user.sessionId = req.sessionID;
      // user.save();
       const result = (await super.canActivate(context)) as boolean;
       const request = context.switchToHttp().getRequest();
       await super.logIn(request);
       
       return result; 
    }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();
    //console.log(req);
    return req.isAuthenticated();
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user;
    if(user.role != UserRoleEnum.ADMIN)
      throw new ForbiddenException(String,"Lack of privileges! That feature is allowed only to admin.");
    return true;
  }
}

@Injectable()
export class UserIdentityGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const user = context.switchToHttp().getRequest().user;
    let userid;
    if(context.switchToHttp().getRequest().params.userid) userid=context.switchToHttp().getRequest().params.userid;
    if(context.switchToHttp().getRequest().query.userid) userid = context.switchToHttp().getRequest().query.userid;
    if(context.switchToHttp().getRequest().body.id) userid = context.switchToHttp().getRequest().body.id;
    if(context.switchToHttp().getRequest().body.ownerID) userid = context.switchToHttp().getRequest().body.ownerID;
    if(user.userid===userid)return true;
    else return false;
    
  }
}

export class ConversationOwnerGuard implements CanActivate {
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const user = context.switchToHttp().getRequest().user;
    let conversationId;
    if(context.switchToHttp().getRequest().params.conversationid)conversationId=context.switchToHttp().getRequest().params.conversationid;
    if(context.switchToHttp().getRequest().query.conversationid) conversationId = context.switchToHttp().getRequest().query.conversationid;
    if(context.switchToHttp().getRequest().body.conversationid) conversationId = context.switchToHttp().getRequest().body.conversationid;
    const owner = await User.createQueryBuilder("user")
    .leftJoinAndSelect("user.ownings","conversations")
    .where("conversations.conversationId=:id",{id:conversationId})
    .getOne();
    
    if(owner.userid===user.userid) return true;
    else return false;
  }
}