import { CanActivate, ExecutionContext, ForbiddenException, Injectable} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoleEnum } from "src/utils/types";

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
