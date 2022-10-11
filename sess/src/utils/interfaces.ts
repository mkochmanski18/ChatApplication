import { Socket } from "socket.io";
import { User } from "src/user/user.entity";
import { UserRoleEnum,TokenTypeEnum } from "src/utils/types";

export interface ExtededSocket extends Socket{
    user?: User;
}

export interface friendData{
    userid: string;
    friendname: string
}

export interface userData{
    userid:string;
    name:string;
    email:string;
    sex:string;
    role:UserRoleEnum,
    confirmed?:boolean;
}

export interface IToken {
    readonly tokenId: string  
    readonly exp: number
    readonly role: UserRoleEnum
    readonly iat: number
    readonly id: string
    readonly email: string
    readonly type: TokenTypeEnum
  }
