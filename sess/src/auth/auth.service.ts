import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { hashPwd } from 'src/utils/hash-pwd';

@Injectable()
export class AuthService {
    async validateUser(email:string,password:string){
        const user = await User.findOne({email});
        if (!user)
            throw new HttpException('Invalid Credentials', HttpStatus.UNAUTHORIZED);
        const isPasswordValid = user.pwdHash === hashPwd(password) ? true:false;
        
        const userData = {
            userid:user.userid,
            name:user.name,
            sex:user.sex,
            email:user.sex,
            role:user.role
        }
        const result = isPasswordValid ? userData : null;
        if(result) console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] logged in!");
        return result;
}}

