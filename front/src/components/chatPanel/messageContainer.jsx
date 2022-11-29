import MessageBlock from './messageBlock';
import UserPhoto from '../blockComponents/userPhoto';
const MessageContainer = ({data,lastMessage}) =>{
    const userId = localStorage.getItem("userId");
    return(
        <div style=
        {data.senderData.userid!==userId?{display:"flex",justifyContent:"flex-start",width:"100%"}:
        {display:"flex",justifyContent:"flex-end",width:"100%"}}>
            
            {data.senderData.userid===userId?
            <>
                <MessageBlock key={"key-"+data.datetime} data={data} lastMessage={lastMessage}/>
            </>:
            <>
            {!lastMessage||data.senderData.userid!==lastMessage.senderData.userid?
                <UserPhoto userData={data.senderData}/>:null}
                <MessageBlock data={data} lastMessage={lastMessage}/>
            </>
            }
            
        </div>
    )
}
export default MessageContainer;