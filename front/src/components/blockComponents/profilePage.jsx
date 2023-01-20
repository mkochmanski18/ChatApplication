import { useState,useEffect, useContext } from "react";
import {useParams} from 'react-router-dom';
import InstanceContext from '../context/instance/InstanceContext';
import UserPhoto from "./userPhoto";
import {MdEmail} from 'react-icons/md';
import {TbGenderBigender} from 'react-icons/tb';
import UserTile from "./userTile";

const ProfilePage = () =>{

    let params = useParams();
    const friendId = params.userid;
    const userId = localStorage.getItem("userId");
    const [userData,setUserData] = useState();
    const [isFriend,setIsFriend] = useState();
    const [commonFriends,setCommonFriends] = useState();
    const instance = useContext(InstanceContext);

    async function fetchUserData(){
        await instance.get("/user/search/id/"+friendId, { withCredentials: true,sameSite:false})
        .then(res=>{
            setUserData(res.data);
        })
        .catch(res=>console.log(res));
    }

    async function isUserFriend(){
        await instance.get("/friend/isFriend?userid="+userId+"&&friendid="+friendId, { withCredentials: true,sameSite:false})
        .then(res=>setIsFriend(res.data))
        .catch(res=>console.log(res));
    }
    async function getCommonFriends(){
        await instance.get("/friend/commonlist?userid="+userId+"&&friendid="+friendId, { withCredentials: true,sameSite:false})
        .then(res=>setCommonFriends(res.data))
        .catch(res=>console.log(res));
    }

    function relationshipText(status){
        let text,color;
        if(status===0) {
            text = "Użytkownik niezaproszony";
            color = "gray"}
        else if(status===1|status===3) {
            text = "Wysłano zaproszenie";
            color="yellow"}
        else if(status===2) {
            text="Znajomy";
            color="green"}
        return <span style={{fontSize:"25px", color}}> {text}</span>
    }
    useEffect(()=>{
        fetchUserData(userId);
        isUserFriend();
        getCommonFriends();
        console.log(commonFriends)
    },[])
    return(
        <div style={{width:"100%"}}>
            <div style={{display:"flex",justifyContent:"center"}}>
                <div style={{padding: "55px 20px"}}>
                    {userData?
                    <UserPhoto userData={userData} size="150px"/>:null}
                </div>
                <div style={{color:"white", padding: "20px 0px", marginTop:"30px"}}>
                    <div>
                        <span style={{fontSize:"25px"}}> {userData?.firstname} </span>
                        <span style={{fontSize:"25px"}}> {userData?.lastname} </span>
                        <span style={{fontSize:"25px"}}> ({userData?.name}) </span>
                    </div>
                    <div>
                        <span style={{fontSize:"25px", color:"gray"}}> <MdEmail/> { userData?.email } </span>
                    </div>
                    <div>
                    <TbGenderBigender size="30px" color="gray"/>
                        <span style={{fontSize:"25px", color:"gray"}}> { userData?.sex } </span><br/>
                        {relationshipText(isFriend)}
                    </div>
                </div>
            </div>
            <hr style={{color:"white",width:"90%",margin:"30px 5%"}}/>
            <div>
                <h3 style={{color:"white",padding:"50px",textAlign:"center"}}>Wspólni znajomi</h3>
                    {commonFriends&&commonFriends.map(user=>{
                        return(
                        //     <div style={{display:"flex"}}>
                        //     <UserPhoto userData={user}/>
                        //     <div style={{display:"block"}}>
                        //         <div style={{color:"white"}}>{user.firstname + " "+user.lastname}</div>
                        //         <div style={{color:"gray"}}>{user.name}</div>
                        //         <div style={{color:"gray"}}>{user.email}</div>
                        //     </div>  
                        // </div>
                        <UserTile user={user}/>
                        )
                    })}

            </div>
        </div>
    )
}
export default ProfilePage