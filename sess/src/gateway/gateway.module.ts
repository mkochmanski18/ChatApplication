import { Module } from "@nestjs/common";
import { ConversationModule } from "src/conversation/conversation.module";
import { FriendModule } from "src/friend/friend.module";
import { GatewaySessionManager } from "./gateway.session";
import { MessageGateway } from "./websocket.gateway";

@Module({
    imports:[
        ConversationModule,
        FriendModule
    ],
    providers:[
        MessageGateway,
        GatewaySessionManager,
    ],
    exports: [
        MessageGateway,
        GatewaySessionManager,
      ],
})
export class GatewayModule{}