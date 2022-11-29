import { useEffect, useState, useContext } from "react";
import UserTile from "../../blockComponents/userTile";
import InstanceContext from "../../context/instance/InstanceContext";

const ActualFriends = () =>{

    const instance = useContext(InstanceContext);
    const userId = localStorage.getItem("userId");
    const [friendList,setFriendList] = useState([]);

    async function getFriends(){
        await instance.get("/friend/list?userid="+userId,
        { withCredentials: true,sameSite:false})
        .then(res=>setFriendList(res.data))
        .catch(err=>console.log(err));
    }
    useEffect(()=>{
        getFriends();
    },[])
    return(
        <div>
            {friendList&&friendList.map(user=>{
                return(
                    <div>
                        <UserTile user={user}/>
                    </div>
                )
            })}
        </div>
    )
}
export default ActualFriends