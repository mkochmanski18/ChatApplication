import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/user/user.entity";
import { AuthService } from "./auth.service";

export class SessionSerializer extends PassportSerializer{
    constructor(private readonly authService: AuthService) {
        super();
    }
    serializeUser(user: User, done: (err: any,user:User)=>void) {
        done(null,user);
    }
    async deserializeUser(user: User, done: (err: any,user:User)=>void) {
        const userDB = await User.findOne({userid:user.userid});
        //console.log(userDB)
        return userDB ? done(null,userDB):done(null,null);
    }
}