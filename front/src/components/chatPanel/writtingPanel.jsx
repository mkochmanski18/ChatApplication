import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ReactTextareaAutosize from "react-textarea-autosize";
import {IoSend} from 'react-icons/io5';
import InstanceContext from "../context/instance/InstanceContext";
const WrittingPanel = () =>{
    const instance = useContext(InstanceContext);
    const userId = localStorage.getItem("userId");
    let params = useParams();
    
    const [text,setText] = useState("");
   
    async function send(){
        const conversationId = params.conversationid;
        const body = {
            senderId:userId,
            conversationId:conversationId,
            datetime: new Date(),
            text:text
        }
        await instance.post("/message/newText",body, { withCredentials: true,sameSite:false})
        .then(res=>{
            console.log(res);
        })
        .catch(res=>console.log(res))
        setText("");
    }
    return(
        <div style={{position:"relative",marginTop:"20px"}}>
        <ReactTextareaAutosize style={{width:"100%",resize:"none",outline:"none",padding:"5px 70px 5px 15px"}} value={text} onChange={(e)=>setText(e.target.value)}/>
        <IoSend style={
            {
                color:"green",
                position:"absolute",
                fontSize:"1.5em", 
                right:"30px", 
                bottom:"10px"
            }}
            onClick={()=>send()}
        />
        </div>
    )
}
export default WrittingPanel;