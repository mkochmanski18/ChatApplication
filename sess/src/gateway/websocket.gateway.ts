import { HttpException, HttpStatus, Inject } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { WebSocketGateway, WebSocketServer, SubscribeMessage,MessageBody, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from "@nestjs/websockets";
import { Server } from "socket.io";
import { Conversation } from "src/conversation/conversation.entity";
import { ConversationService } from "src/conversation/conversation.service";
import { FriendService } from "src/friend/friend.service";
import { ExtededSocket } from "src/utils/interfaces";
import { GatewaySessionManager } from "./gateway.session";

@WebSocketGateway({
    cors:{
        origin:['http://localhost:3000'],
        credentials:true,
    },
    pingInterval: 10000,
    pingTimeout: 15000,
})
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect{

    constructor(
        readonly sessions: GatewaySessionManager,
        readonly conversationService: ConversationService,
        readonly friendService: FriendService,
      ) {}

    handleConnection(socket: ExtededSocket, ...args: any[]) {
    console.log('Incoming Connection');
    console.log(`${socket.user.name} connected.`);
    this.sessions.setUserSocket(socket.user.userid, socket);
    socket.emit('connected', {});
  }

  handleDisconnect(socket: ExtededSocket) {
    console.log('handleDisconnect');
    console.log(`${socket.user.name} disconnected.`);
    this.sessions.removeUserSocket(socket.user.userid);
  }
    @WebSocketServer()
    server: Server;

    @OnEvent('message.create')
    async handleMessageCreateEvent(@MessageBody() data:any){
      console.log('Inside message.create');
      
      const { conversationId} = data.conversation;
      const {participants} = await this.conversationService.getConversation(conversationId)
      
      participants.forEach(user=>{
        const recipientSocket = this.sessions.getUserSocket(user.userid);
        if (recipientSocket) recipientSocket.emit('onMessage', data);
      })
    }

    @OnEvent('conversation.create')
    async handleConversationCreateEvent(@MessageBody() data:Conversation){
      console.log('Inside conversation.create');
      
      const conversation = data;
      conversation.participants.forEach(user=>{
        const recipientSocket = this.sessions.getUserSocket(user.userid);
        if (recipientSocket) recipientSocket.emit('onConversationCreate', data);
      })
    }

    @OnEvent('conversation.update')
    async handleConversationUpdateEvent(@MessageBody() data:Conversation){
      console.log('Inside conversation.update');
      
      const conversation = data;
      conversation.participants.forEach(user=>{
        const recipientSocket = this.sessions.getUserSocket(user.userid);
        if (recipientSocket) recipientSocket.emit('onConversationUpdate', data);
      })
    }

    @OnEvent('inviting.create')
    async handleInvitingCreateEvent(@MessageBody() data:any){
      console.log('Inside inviting.create');
      
      const user = data;
      const recipientSocket = this.sessions.getUserSocket(user.userid);
      if (recipientSocket) recipientSocket.emit('onInvitingCreate');
    }

    @OnEvent('friend.update')
    async handleFriendUpdateEvent(@MessageBody() data:any){
      console.log('Inside friend.update');
      
      const { user,friend} = data;
      
        const userSocket = this.sessions.getUserSocket(friend);
        if (userSocket) userSocket.emit('onFriendUpdate');

        const friendSocket = this.sessions.getUserSocket(user);
        if (friendSocket) friendSocket.emit('onFriendUpdate');
     
    }

    @SubscribeMessage('getOnlineUsers')
    async handleGetOnlineUsers(
    @MessageBody() data: any,
    @ConnectedSocket() socket: ExtededSocket) {
    const friends = await this.friendService.getFriendList(data);
    if (!friends) return;
    const onlineUsers = [];
    const offlineUsers = [];
    console.log(friends)
    friends.forEach((user) => {
      const socket = this.sessions.getUserSocket(user.userid);
      console.log(socket)
      socket ? onlineUsers.push(user) : offlineUsers.push(user);
    });
    socket.emit('onlineUsersReceived', { onlineUsers, offlineUsers });
  }
}