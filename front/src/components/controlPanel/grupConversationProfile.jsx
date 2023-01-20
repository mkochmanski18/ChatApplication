import UserPhoto from "../blockComponents/userPhoto";
import { NavLink } from "react-router-dom";

const GroupConversationProfile = ({conversation}) =>{
    return(
        <NavLink to={"/chat/"+conversation.conversationId}>
        <div as={NavLink}  style={{display:"flex"}} >
            <UserPhoto userData={conversation}/>
            <div style={{display:"block"}}>
                <div>{conversation.name}</div>
                <div>Ilość uczestników: {conversation.newParticipantsArray.length}</div>
            </div>
        </div>
        </NavLink>
    )
} 
export default GroupConversationProfile;