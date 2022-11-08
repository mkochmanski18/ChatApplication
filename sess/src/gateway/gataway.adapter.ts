import { IoAdapter } from "@nestjs/platform-socket.io";
import { ExtededSocket } from "src/utils/interfaces";
import * as cookieParser from 'cookie-parser';
import * as cookie from 'cookie';
import { Session } from "src/auth/session.entity";
import { plainToInstance } from 'class-transformer';
import { User } from "src/user/user.entity";

export class WebSocketAdapter extends IoAdapter{
    createIOServer(port: number, options?: any) {
        const server = super.createIOServer(port,options);
        server.use(async(socket:ExtededSocket,next)=>{
            console.log('Inside Websocket Adapter');
            const { cookie: clientCookie } = socket.handshake.headers;
            if (!clientCookie) {
                console.log('Client has no cookies');
                return next(new Error('Not Authenticated. No cookies were sent'));
            }
            const { CHAT_SESSION_ID } = cookie.parse(clientCookie);
            if (!CHAT_SESSION_ID) {
                console.log('CHAT_SESSION_ID DOES NOT EXIST');
                return next(new Error('Not Authenticated'));
            }
            const signedCookie = cookieParser.signedCookie(CHAT_SESSION_ID,"asdhjhk234");
            if (!signedCookie) return next(new Error('Error signing cookie'));
            const session = await Session.findOne({ id: signedCookie });
            if (!session) return next(new Error('No session found'));
            const userDB = plainToInstance(
                User,JSON.parse(session.json).passport.user,
            );
            socket.user = userDB;
            next();
        });
        return server;
    }
}