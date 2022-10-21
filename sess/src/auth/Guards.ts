import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { Observable } from 'rxjs';
import { UserRoleEnum } from "src/utils/types";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
      
      // const user = await User.findOne({userid:req.user.userid})
      // console.log(user,req.sessionID)
      // user.sessionId = req.sessionID;
      // user.save();
       const result = (await super.canActivate(context)) as boolean;
       const request = context.switchToHttp().getRequest();
       //console.log(request)
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