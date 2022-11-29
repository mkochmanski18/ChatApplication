import UserPhoto from "./userPhoto";
import Actions from "./actions";
import {useNavigate} from 'react-router-dom';
import { Card } from "react-bootstrap";

const UserTile = ({user,isConfirmed}) =>{
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const opacityDown = (name,state)=>{
        if(document.getElementById(name)){
        if(state===1) {
            document.getElementById(name).style.opacity = "80%";
            document.getElementById(name).style.cursor="pointer";
        }
        if(state===2) {
            document.getElementById(name).style.opacity = "100%";
            document.getElementById(name).style.cursor="auto";
        }}
    };
    return(
<>
        {user.userid!==userId?
            <Card className="bg-dark text-white" 
                style={{display:"flex",padding:"5px",flexDirection:"row",justifyContent:"flex-start",width:"60%",minWidth:"340px",maxWidth:"500px",margin:"15px auto"}} 
                key={"userRow."+user.userid}
                id={"userRow."+user.userid} 
                onMouseOut={()=>opacityDown("userRow"+user.userid,2)} 
                onMouseOver={()=>opacityDown("userRow"+user.userid,1)}
                onClick={()=>navigate('chat//profile/'+user.userid)}>
                <UserPhoto userData={user}/>
                <div style={{display:"block",margin:"8px 0px"}} key={"div.data."+user.userid}>
                    <div 
                        style={{color:"white"}}
                        key={"div.data.name"+user.userid}>
                            {user.firstname+" "+user.lastname}
                    </div>
                    <div                   
                        style={{color:"gray"}}
                        key={"div.data.email"+user.userid}>
                            {user.email}
                    </div>
                </div>
                <Actions user={user} key={"div.actions."+user.userid}/>
            </Card>:null}</>
                    
    )
}
export default UserTile