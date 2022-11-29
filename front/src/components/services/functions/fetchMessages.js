async function fetchMessages(instance,conversationId,listOfMessages){
    
    await instance.get("/conversation/messages/"+conversationId, { withCredentials: true,sameSite:false})
    .then(response=>{
      listOfMessages.current[response.data[0].conversation.conversationId]=[...response.data];
      return response.data;
    })
    .catch(res=>{
      console.log(res);
      if(res.status===403) return res.status;
    })
  }
export default fetchMessages