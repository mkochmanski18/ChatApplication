import { Injectable } from "@nestjs/common";
import { ExtededSocket } from "src/utils/interfaces";

export interface GatewaySession{
    getUserSocket(id:string);

}

@Injectable()
export class GatewaySessionManager implements GatewaySession{
    private readonly sessions:Map<string, ExtededSocket> = new Map();
    
    getUserSocket(id: string):ExtededSocket {
        return this.sessions.get(id);
    }

    setUserSocket(userid: string, socket:ExtededSocket){
        this.sessions.set(userid, socket);
    }
    removeUserSocket(userid:string){
        this.sessions.delete(userid);
    }
    getSockets():Map<string,ExtededSocket>{
        return this.sessions; 
    }
    
}