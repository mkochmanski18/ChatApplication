import { useEffect, useState, useContext } from "react";
import InstanceContext from "../context/instance/InstanceContext";
const GroupsManagement = () =>{

    const instance = useContext(InstanceContext);
    const [conversations,setConversations] = useState([]);
    const userId = localStorage.getItem("userId");
    async function getConversations(){
        await instance.get("/conversation/user/"+userId,
        { withCredentials: true,sameSite:false})
        .then(res=>{setConversations(res.data);
            console.log(conversations);})
        .catch(err=>console.log(err));
    } 
    useEffect(()=>{
        getConversations();
    },[])
    return(
        <>
            <h3>Moje Grupy</h3>
            {conversations&&conversations.map(conv=>{
                return(
                    <div>

                    </div>
                )
            })}
        </>
    )
}
export default GroupsManagement;