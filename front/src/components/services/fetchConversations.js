async function fetchConversations(instance) {
    const userId = localStorage.getItem("userId");
    let conversations;
    await instance.get('/conversation/user/'+userId, { withCredentials: true,sameSite:false})
    .then(response=>conversations = response.data)
    .catch(response=>console.log(response))

    return conversations;
  }
export default fetchConversations