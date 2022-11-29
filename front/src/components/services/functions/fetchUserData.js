async function fetchUserData(instance,conversationId) {
    const userId = localStorage.getItem("userId");
    let array = [];
      await instance.get('conversation/'+conversationId, { withCredentials: true,sameSite:false})
      .then(response=>{
        response.data.participants.forEach((object)=>{
          if(object.userid!==userId) {
              array.push(object);
          } 
        });
      })
      .catch(response=>console.log(response));
      return array;
    };
export default fetchUserData