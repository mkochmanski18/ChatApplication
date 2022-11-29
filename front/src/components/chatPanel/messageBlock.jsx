import styles from "./styles";
const MessageBlock = ({data,lastMessage}) =>{

    const {Message,MessageText,DataBlock,SenderDateBlock,ReceiverDateBlock} = styles;
    const user = data.senderData;
    const userId = localStorage.getItem("userId");
    const date = new Date(data.datetime);
    
    return(
        <> 
            <div style={lastMessage?.date===data.date&&data.senderid!==userId?{marginLeft:"65px"}:null}
                >
                <DataBlock as={user.userid===userId?SenderDateBlock:ReceiverDateBlock}>
                    {date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()}
                </DataBlock>
                <Message>
                    <MessageText 
                        className={user.userid===userId?"bg-secondary text-white":"bg-success text-white"}
                        >
                        <span>{data.content}</span>
                    </MessageText>
                </Message>
            </div>
        </>
    )
}

export default MessageBlock;