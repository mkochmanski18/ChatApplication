import { useState,useEffect,useContext,useRef } from "react";
import InstanceContext from "../context/instance/InstanceContext";
import {BiCheck} from 'react-icons/bi';
import styles from "../configurationPages/styles";

import sendInvitation from "../services/functions/sendInvtitaion";
import deleteFriend from "../services/functions/deleteFriend";

const Actions = ({user}) =>{
    const {CommunicateSuccess,InvitingButton} = styles;
    const [friendshipStatus,setFriendshipStatus] = useState();
    const invitationState = useRef();
    const instance = useContext(InstanceContext);
    const userId = localStorage.getItem("userId");

    useEffect(()=>{
        instance.get("/friend/isFriend?userid="+userId+"&&friendid="+user.userid, 
        { withCredentials: true,sameSite:false})
        .then(res=>{setFriendshipStatus(res.data)})
        .catch(err=>console.log(err));
    },[instance,user,userId])

    return(<>
        {invitationState.current?
            <CommunicateSuccess>
                Zaproszono użytkownika
            </CommunicateSuccess>
            :null
        }
        
        <div style={{display:"flex"}}>
            {friendshipStatus&&(friendshipStatus===1||friendshipStatus===3)?
                <CommunicateSuccess>
                    <BiCheck size="20px"/><span>Użytkownik został zaproszony</span>
                </CommunicateSuccess>:null
            }
            {friendshipStatus&&friendshipStatus===2?
                <InvitingButton variant="danger" onClick={()=>deleteFriend(instance,user.userid)}>
                    Usuń Znajomego
                </InvitingButton>:null}
            {friendshipStatus&&friendshipStatus===0?
                <InvitingButton onClick={()=>sendInvitation(instance,user.userid,invitationState)}>
                    Zaproś do znajomych
                </InvitingButton>:null
            }
        </div>
        </>
    )
}
export default Actions;