import styles from "./styles";
import { useEffect, useState } from "react";

const UserPhoto = ({userData}) =>{
    
    const {Photo,UserIcon} = styles;
    const [photo,setPhoto] = useState();

    useEffect(()=>{
            if(userData.photo) setPhoto("http://localhost:5000/user/photo/"+userData.photo);
           
    },[userData.photo])

    return(
        <>
        {photo?
            <Photo src={photo}/>:
            <UserIcon/>}
        </>
    )
}
export default UserPhoto;