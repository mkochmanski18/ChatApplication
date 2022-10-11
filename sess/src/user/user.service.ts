import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { hashPwd } from 'src/utils/hash-pwd';
import { User } from './user.entity';
import { RegisterDto } from './dto/register.dto';
import { userData, IToken } from 'src/utils/interfaces';
import { TokenTypeEnum, UserRoleEnum} from "src/utils/types";
import * as jwt from 'jsonwebtoken';
import { pwdChangeDto } from './dto/pwdChange.dto';
import {address, port} from 'src/utils/config';
import { Token } from './token.entity';
import { v4 as uuid } from 'uuid';
import { getRepository } from 'typeorm';
"use strict";
const nodemailer = require("nodemailer");

@Injectable()
export class UserService {

    regFilter(user:User):userData{
        const {userid, name, sex, email, role} = user;
        return {userid,name,sex,email, role};
    }
    userDataFilter(user:User):userData{
      const {userid, name,email, sex, role} = user;
      return {userid,name,email,sex, role};
  }

  transporter = nodemailer.createTransport({
    host: "smtp.mailosaur.net",
    port: 587,
    auth: {
      user: 'cxiucuiv@mailosaur.net',
      pass: 'cbi266guPXHdBpAZ'
    }
});

validateToken(token: string): IToken {
  return jwt.verify(token, 'WSfSfqjVKA495z5qJ9') as IToken
}

createToken(tokenId:string, user: userData, type:TokenTypeEnum): string {
  const payload = {
    tokenId,
    email: user.email,
    id: user.userid,
    role: user.role,
    type,
  }
  const expiresIn = 60 * 60 * 24;
  return jwt.sign(payload,'WSfSfqjVKA495z5qJ9',{ expiresIn})
}
    async register(newUser:RegisterDto):Promise<HttpException|userData>{
      
            const checkemail = await User.findOne({
              email:newUser.email,
            });
            const checkname = await User.findOne({
              name:newUser.name,
            });
            if(checkemail){
              throw new HttpException("User already exists!", HttpStatus.NOT_ACCEPTABLE)
            }
            else if(checkname){
              throw new HttpException("User name is taken!", HttpStatus.CONFLICT)
            }
            else{
                const user = new User();
                user.email = newUser.email;
                user.name = newUser.name;
                user.sex = newUser.sex;
                user.role = UserRoleEnum.REGULAR;
                user.pwdHash = hashPwd(newUser.pwd);
                
                await user.save();
                console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] Created!");

                //sending mail with confirmation
                let message:string = "Hello "+user.name+"!\n This email has been generated automaticaly. Don't answer this message.\n"+
                "It contains account confirmation link. If you got this mail by accident, just ignore this mail.\n "+
                "If you're expecting this email, just click in link below.\n"+address+":"+port+"/user/confirmation/"+user.userid;
                let htmlmessage = 
                "<div style='text-align:center'><h5>Hello "+user.name+"!</h5><p>This email has been generated automaticaly. Don't answer this message.</p>"+
                "<p>It contains account confirmation link. If you got this mail by accident, just ignore this mail.</p>"+
                "<p>If you're expecting this email, just click in link below.</p>"+
                "<p>"+address+":"+port+"/user/confirmation/"+user.userid+"</p></div>";

                console.log(message)
                let info = await this.transporter.sendMail({
                  from: '"ChatApplication" <mail@chatapp.com>', // sender address
                  to: user.email, // list of receivers
                  subject: "Confirm email account!", // Subject line
                  text: message, // plain text body
                  html: htmlmessage, // html body
                });
              
                console.log("[INFO] "+new Date().toUTCString()+" - Message sent: %s", info.messageId);
                return user;
            }
        }
      async deleteAccount(userid):Promise<HttpException>{
        const user = await User.findOne({userid:userid});
        if (!user) throw new HttpException({message:"User doesn't exists"}, HttpStatus.NOT_FOUND)
        Token.delete({owner:user});
        User.delete({userid:userid});
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] has been deleted!");
        throw new HttpException({message:"User deleted"}, HttpStatus.OK)
      }

      async confirmAccount(userid: string): Promise<HttpException> {
        const user = await User.findOne({userid:userid})
        console.log(userid)
        if(!user){
          throw new HttpException("User doesn't exist", HttpStatus.NOT_FOUND);
        }
        user.confirmed = true;
        user.save();
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"]'s email has been confrimed!");
        throw new HttpException("User's account has been confirmed", HttpStatus.OK)
      
      }

      async changePassword(data:pwdChangeDto): Promise<HttpException> {
        const user = await User.findOne({
          userid: data.id
        });
        if (!user) {
          throw new HttpException("User doesn't exist",HttpStatus.NOT_FOUND)
        }
        if(hashPwd(data.oldPassword) != user.pwdHash)
          throw new HttpException("Incorrect Password",HttpStatus.FORBIDDEN);
        user.pwdHash = hashPwd(data.newPassword)
        user.save();

        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] changed password!");
        throw new HttpException("Password Changed",HttpStatus.OK)

      }

      async resetPasswordRequest(email: string): Promise<HttpException> {
        const user = await User.findOne({
          email: email
        });
        if (!user) {
          throw new HttpException("User doesn't exist!",HttpStatus.NOT_FOUND)
        }
        //creating resetToken
        let tokenId;
        let userWithThisToken = null;
        do {
            tokenId = uuid();
            userWithThisToken = await Token.findOne({ resetTokenId: tokenId });
        } while (!!userWithThisToken);

        const token:string = this.createToken(tokenId,user, TokenTypeEnum.RESET);
        const tokenList = await Token.findOne({owner:user});
        tokenList.resetTokenId = tokenId;
        tokenList.owner = user;
        await tokenList.save();
        await user.save();
        //sending mail with confirmation
        let message = 
        "Hello "+user.name+"!\n This email has been generated automaticaly. Don't answer this message. \nIt contains reset password link. If you got this mail by accident, just ignore this mail.\nIf you're expecting this email, just click in link below, to reset your account password.\n"+address+":"+port+"/user/reset/"+token;
        let htmlmessage = 
        "<div style='text-align:center'><h5>Hello "+user.name+"!</h5><p>This email has been generated automaticaly. Don't answer this message.</p>"+
        "<p>It contains reset password link. If you got this mail by accident, just ignore this mail.</p>"+
        "<p>If you're expecting this email, just click in link below, to reset your account password</p>"+
        "<p>"+address+":"+port+"/user/reset/"+token+"</p></div>";
        console.log(message)
        let info = await this.transporter.sendMail({
          from: '"ChatApp" <mail@chatapp.com>', // sender address
          to: user.email, // list of receivers
          subject: "Reset Account password!", // Subject line
          text: message, // plain text body
          html: htmlmessage, // html body
        });
      
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - Reset Link in Message sent: %s", info.messageId);
        throw new HttpException({message:"Reset Password Link Sended"}, HttpStatus.OK)
    }

      async resetPassword(password:string, token:string): Promise<HttpException> {
        const payload = this.validateToken(token);
        //console.log(payload)

        const checktoken = await Token.findOne({resetTokenId:payload.tokenId})
        if(!checktoken) throw new HttpException("Link is incorrect!", HttpStatus.FORBIDDEN)

        
        const user = await User.findOne({email:payload.email})
        const newPwdHash = hashPwd(password)
        if(newPwdHash == user.pwdHash) 
          throw new HttpException("Password is reapeted!", HttpStatus.NOT_ACCEPTABLE)
        user.pwdHash = newPwdHash;
        user.save();
        checktoken.resetTokenId = null;
        checktoken.save();
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] changed password!");
        throw new HttpException("User account password has been changed", HttpStatus.OK)
      }

      getUsers(){
        const users = User.find();
        return users;
      }
      
      async searchUserById(userid:string):Promise<HttpException|userData>{
        
        const searchedUser = await getRepository(User)
        .createQueryBuilder("user")
        .select("user.userid,user.name,user.sex,user.email")
        .where("userid=:userid",{userid})
        .getRawOne();
        if(!searchedUser)
          throw new HttpException("User doesn't exist!", HttpStatus.NOT_FOUND);
        return searchedUser;
      }

      async searchUserByName(name:string):Promise<HttpException|userData>{
        
        const searchedUser = await getRepository(User)
        .createQueryBuilder("user")
        .select("user.userid,user.name,user.sex,user.email")
        .where("name=:name",{name})
        .getRawOne();
        if(!searchedUser)
          throw new HttpException("User doesn't exist!", HttpStatus.NOT_FOUND);
        return searchedUser;
      }

      async searchUserByEmail(email:string):Promise<HttpException|userData>{
        const searchedUser = await getRepository(User)
        .createQueryBuilder("user")
        .select("user.userid,user.name,user.sex,user.email")
        .where("email=:email",{email})
        .getRawOne();
        if(!searchedUser)
          throw new HttpException("User doesn't exist!", HttpStatus.NOT_FOUND)
        return searchedUser;
      }

      async changeUsername(userid:string, newname:string):Promise<HttpException>{
        const user = await User.findOne({userid});
        if(!user)
          throw new HttpException("User doesn't exist!", HttpStatus.NOT_FOUND)

        const checkname = await User.findOne({name:newname});
        if(!checkname || checkname != user) 
          throw new HttpException("Username is already in use!", HttpStatus.NOT_ACCEPTABLE);
        const oldname = user.name;
        user.name = newname;
        user.save();
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ oldname+"["+user.email+"] changed name to "+newname+"!");
        throw new HttpException("User data changed", HttpStatus.OK);
      }

      async changeUserEmail(userid:string, newemail:string):Promise<HttpException>{
        const user = await User.findOne({userid});
        if(!user)
          throw new HttpException("User doesn't exist!", HttpStatus.NOT_FOUND)

        const checkemail = await User.findOne({email:newemail});
        if(!checkemail || checkemail != user) 
          throw new HttpException("Email is already in use!", HttpStatus.NOT_ACCEPTABLE);
        const oldemail = user.email;
        user.email = newemail;
        user.save();
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+oldemail+"] changed email to "+newemail+"!");
        throw new HttpException("User data changed", HttpStatus.OK);
      }

      async changeUserSex(userid:string, newsex:string):Promise<HttpException>{
        const user = await User.findOne({userid});
        if(!user)
          throw new HttpException("User doesn't exist!", HttpStatus.NOT_FOUND)

        user.sex = newsex;
        user.save();
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] changed sex to "+newsex+"!");
        throw new HttpException("User data changed", HttpStatus.OK);
      }

      async changeUserRole(userid:string, newrole:UserRoleEnum):Promise<HttpException>{
        const user = await User.findOne({userid});
        if(!user)
          throw new HttpException("User doesn't exist!", HttpStatus.NOT_FOUND)

        user.role = newrole;
        user.save();
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] changed name to "+newrole+"!");
        throw new HttpException("User data changed", HttpStatus.OK);
      }

      async uploadPhoto(file,id){
        const user = await User.findOne({userid:id});
        if(!user) throw new HttpException("User doesn't exist!", HttpStatus.NOT_FOUND)
        user.photo = file.filename;
        user.save();
        console.log("[CHAT][INFO] "+new Date().toUTCString()+" - User: "+ user.name+"["+user.email+"] uploaded photo:"+file.filename+"!");
        throw new HttpException("Photo has been uploaded", HttpStatus.CREATED)
            
      }
}

