import { useEffect, useState, useContext, useRef } from 'react';
import {Route,Routes,useNavigate} from 'react-router-dom';
import io from 'socket.io-client';
import BlockPanel from './controlPanel/blockPanel';
import ChatPanel from './chatPanel/chatPanel';
import FriendsManagement from './configurationPages/friendsManagement';
import GroupsManagement from './configurationPages/groupManagement';
import SocketContext from './context/socket/SocketContext';
import InstanceContext from './context/instance/InstanceContext';
import ProfilePage from './blockComponents/profilePage';

const ChatContainer = () =>{ 
  const socket = io("http://localhost:5000", {
        withCredentials: true,
        reconnection: true
      });
    const instance = useContext(InstanceContext);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    
    const [listOfConversations,setListOfConversations] = useState([]);
    const listOfMessages = useRef([]);
   
    async function fetchConversations() {
      await instance.get('/conversation/user/'+userId, { withCredentials: true,sameSite:false})
      .then(response=>setListOfConversations(response.data))
      .catch(response=>console.log(response))
    }

      useEffect(()=>{
        fetchConversations();
      },[]);
      useEffect(()=>{
        socket.on("connect_error", () => {
          console.log(`Sesja wygasła..`);
          navigate('/login/418')
        });
        socket.on('connect', () => {
          console.log("connected")
        });
        socket.on('disconnect', () => {
        });
       
        return () => {
          socket.off('connect');
          socket.off('disconnect');
        };
      },[]);
      
    return(
        <>
          <BlockPanel conversations={listOfConversations}/>
          
            <Routes>
              <Route 
                path=":conversationid" 
                element={
                    <SocketContext.Provider value={socket}>
                      <ChatPanel listOfMessages={listOfMessages}/>
                    </SocketContext.Provider>
                  }
              />
              <Route 
                path="/friendsmanagement/*" 
                element={
                  <FriendsManagement/>
                }
              />
              <Route 
                path="/groupsmanagement/*" 
                element={
                  <GroupsManagement/>
                }
              />
              <Route 
                path="/profile/:userid" 
                element={
                  <ProfilePage/>
                }
              />
            </Routes>
          </>
    )
}
export default ChatContainer;