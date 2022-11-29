async function sendInvitation(instance,id,invitationState){
    
    const userId = localStorage.getItem("userId");
    instance.post("/friend/invitation?userid="+userId+"&&friendid="+id,{},
    { withCredentials: true,sameSite:false})
    .then(res=>{
        if(res?.status===200) invitationState.current=true;
    })
    .catch(err=>console.log(err));
    console.log(invitationState)
}
export default sendInvitation