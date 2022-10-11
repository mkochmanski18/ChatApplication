import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';

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