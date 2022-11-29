import MessageContainer from './messageContainer';
import DateRow from '../blockComponents/dateRow';
const MessagesPanel = ({messages}) =>{
    
    return(
        <div style={{height:"100%",width:"100%", display:"flex", flexDirection:"column",overflow:"scroll"}}>
            {messages.length===0 && 
            <div style={{height:"100%"}}>

            </div>}
            {messages.length!==0 && messages.map((message,index)=>{
                
                return(
                     <div 
                        key={message.messageId} 
                        style={{maxWidth:"100vw",overflowX:"clip"}}>

                        {
                        ((messages[index-1]&&messages[index-1].date!==message.date)||!messages[index-1])
                        &&<DateRow messageData={message}/>
                            }
                        <MessageContainer data={message} lastMessage={messages[index-1]} />
                    </div>)})}
        </div>
    )
}

export default MessagesPanel;