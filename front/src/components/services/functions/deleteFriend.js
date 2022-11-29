
async function deleteFriend(instance,id){
    const userId = localStorage.getItem("userId");
    instance.delete("/friend?userid="+userId+"&&friendid="+id,
    { withCredentials: true,sameSite:false})
    .then(res=>console.log(res))
    .catch(err=>console.log(err))
}
export default deleteFriend