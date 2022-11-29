import Information from "./information";
import panelStyles from "./styles";
import UserPhoto from "../blockComponents/userPhoto";
import { useState,useEffect, useContext} from "react";
import { NavLink } from "react-router-dom";
import InstanceContext from "../context/instance/InstanceContext";
import takeParticipants from "../services/functions/takeParticipants";

const Profile = ({conversation}) =>{
    const [friends,setFriends] = useState([]);
    const [isFriend,setIsFriend] = useState();
    const instance = useContext(InstanceContext);
    const {ProfileContainer} = panelStyles;

    useEffect(()=>{
        const array = takeParticipants(conversation,instance,setIsFriend);
        setFriends(array);
    },[conversation,instance])
    
    return(
        <>
        {isFriend&&isFriend===2?
        <ProfileContainer as={NavLink} to={"/chat/"+conversation.conversationId} style={{textDecoration:"None"}}>
            {friends.length>0 && <UserPhoto userData={friends}/>}
            {friends.length>0 && <Information users={friends}/>}
        </ProfileContainer>:null
        }
        </>
    )
}
export default Profile;