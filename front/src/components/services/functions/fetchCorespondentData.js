async function fetchCorespondentData(instance,conversationId) {
    const userId = localStorage.getItem("userId");
    
      await instance.get('conversation/'+conversationId, { withCredentials: true,sameSite:false})
      .then(response=>{
        let array = [];
        response.data.participants.forEach((object)=>{
          if(object.userid!==userId) {
              array.push(object);
          } 
        });
        return array;
      })
      .catch(response=>{
        console.log(response);
        if(response.status===403) return response.status;
        else return 0;});
      
    };
export default fetchCorespondentData