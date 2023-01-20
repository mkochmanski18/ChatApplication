import { useEffect, useState, useContext } from 'react';
import {useParams,useNavigate} from 'react-router-dom';
import SocketContext from '../context/socket/SocketContext';
import InstanceContext from '../context/instance/InstanceContext';
import MessagesPanel from './messagesPanel';
import WrittingPanel from './writtingPanel';
import styles from './styles';

import fetchMessages from '../services/functions/fetchMessages';
const ChatPanel = ({listOfMessages}) =>{
  
    const {ChatCard,CardHeader,LogoutButton,CardBody,LogoutIcon} = styles;
    const instance = useContext(InstanceContext);
    const socket = useContext(SocketContext);

    let params = useParams();
    const conversationId = params.conversationid;

    const [recipients,setRecipients] = useState();
    const [conversationData,setConversationData] = useState();
    const [messages,setMessages] = useState([]);
    const navigate = useNavigate();

    async function fetchCorespondentData() {
      const userId = localStorage.getItem("userId");
      
        await instance.get('conversation/'+conversationId, { withCredentials: true,sameSite:false})
        .then(response=>{
          setConversationData(response.data);
          console.log(response.data)
          let array = [];
          response.data.participants.forEach((object)=>{
            if(object.userid!==userId) {
                array.push(object);
            } 
          });
          setRecipients(array);
          return array;
        })
        .catch(response=>{
          if(response.status===403) return response.status;
          else return 0;});
        
      };

    useEffect(()=>{
      fetchCorespondentData(instance,conversationId);
      
      if(listOfMessages.current[conversationId]){ 
        setMessages(listOfMessages.current[conversationId]);
      }
      else {
        let result = fetchMessages(instance,conversationId,listOfMessages)
        console.log(result)
        if(result!==403) setMessages(result);
        else navigate('/login');
      }
    },[conversationId,instance,messages]);

    useEffect(()=>{
        socket.on('onMessage', (message) => {
            if(listOfMessages?.current[message?.conversation?.conversationId]){
              listOfMessages.current[message.conversation.conversationId].push(message);
              let newSet = listOfMessages.current[message.conversation.conversationId];
              setMessages(newSet);
            }
            else {
              listOfMessages.current[message.conversation.conversationId] = [message];
              setMessages(listOfMessages.current[conversationId]);
            }
          });
          socket.on("connect_error", () => {
            console.log(`Sesja wygasła..`);
            socket.disconnect();
            navigate('/login/418')
          });
          return () => {
            socket.off('onMessage');
          };
          // eslint-disable-next-line react-hooks/exhaustive-deps
    },[socket])
    
    async function logout(navigate){
      await instance.get("/auth/logout", { withCredentials: true,sameSite:false})
      .then(res=>{
        console.log(res);
        socket.disconnect();
        navigate('/login');
      })
      .catch(res=>console.log(res))
    }
      
    return(
        <>
        <ChatCard className="bg-chat text-white">
            <CardHeader>
              {recipients?.length<2 && conversationData&&conversationData.conversationType===0&&recipients[0].firstname + " - "+recipients[0].lastname}
              {conversationData&&conversationData.conversationType===1&&conversationData.name}
              <LogoutButton variant="danger" onClick={()=>logout(navigate)}>
                <LogoutIcon/>
              </LogoutButton>
            </CardHeader>
            <CardBody>
                 {messages.length>0&&
                 <MessagesPanel style={{flexGrow:1,overflowY:"scroll"}} messages={messages}/>}
                 <WrittingPanel/>       
            </CardBody>
        </ChatCard>
        <style type="text/css">
          {`
              .bg-chat {
              background-color: #282c34;
              }
          `}
        </style>
        </>
        )
}

export default ChatPanel;