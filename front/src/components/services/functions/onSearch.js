function onSearch(instance,search,setSearchResult){
    instance.get("/user/search/name/"+search,
    { withCredentials: true,sameSite:false})
    .then(res=>{
        setSearchResult(res.data);
    })
    .catch(err=>console.log(err))
}
export default onSearch