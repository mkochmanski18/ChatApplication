import { useEffect, useState,useContext } from "react";
import {useParams} from 'react-router-dom';
import UserPhoto from "../../blockComponents/userPhoto";
import InstanceContext from '../../context/instance/InstanceContext';
const UserProfile = () =>{
    const [userData,setUserData] = useState();
    let params = useParams();
    const userId = params.userid;
    const instance = useContext(InstanceContext);

    async function getUserData(){
        await instance.get("/user/search/id/"+userId,
        { withCredentials: true,sameSite:false})
        .then(res=>setUserData(res.data))
        .catch(err=>console.log(err));
    }

    useEffect(()=>{
        getUserData();
           
    },[userData.photo])

    return(
        <div>
            {userData&&<UserPhoto userData={userData}/>}
        </div>
    )
}
export default UserProfile