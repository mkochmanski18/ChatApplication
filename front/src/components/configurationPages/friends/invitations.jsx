import { useEffect, useState, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import AcceptButton from "../../blockComponents/acceptButton";
import UserPhoto from "../../blockComponents/userPhoto";
import UserTile from "../../blockComponents/userTile";
import InstanceContext from "../../context/instance/InstanceContext";

const Invitations = () =>{
    
    const instance = useContext(InstanceContext);
    const userId = localStorage.getItem("userId");
    const [invitations,setInvitations] = useState([]);

    async function getInvitings(){
        await instance.get("/friend/invitation?userid="+userId,
        { withCredentials: true,sameSite:false})
        .then(res=>{setInvitations(res.data);console.log(res.data)})
        .catch(err=>console.log(err));
    }
    useEffect(()=>{
        getInvitings();
    },[])
    return(
        <div style={{margin:"10px 20px"}}>
            {invitations.length!==0 ?invitations.map(invitation=>{
                return(
                        <Card className="bg-dark text-white" style={{width:"50%",maxWidth:"500px",margin:"15px auto",display:"flex",flexDirection:"row",justifyContent:"space-around"}}>
                            <UserPhoto userData={invitation}/>
                            <div style={{display:"block",margin:"auto 5px"}}>
                                <div> {invitation.firstname+" "+invitation.lastname} </div>
                                <div>{invitation.email}</div>
                            </div>
                            <AcceptButton friendid={invitation.userid}/>
                        </Card>
                )
            }):
            <div style={{width:"200px",margin:"20% auto",color:"white", textAlign:"center"}}>
                Brak zaproszeń
            </div>}
        </div>
    )
}
export default Invitations