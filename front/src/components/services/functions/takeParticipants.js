function takeParticipants(conversation,instance,setIsFriend){
    
    const userId = localStorage.getItem("userId");
    let array = [];
    conversation.newParticipantsArray.forEach((object)=>{
        if(object.userid!==userId) {
            array.push(object);
        } 
      });
    if(array.length===1){
        instance.get("/friend/isFriend?userid="+userId+"&&friendid="+array[0].userid, 
        { withCredentials: true,sameSite:false})
        .then(res=>setIsFriend(res.data))
        .catch(err=>console.log(err));
    }
    return array;
}
export default takeParticipants