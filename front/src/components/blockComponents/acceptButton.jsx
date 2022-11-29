import { Button } from "react-bootstrap";
import { useContext } from "react";
import InstanceContext from "../context/instance/InstanceContext";

const AcceptButton = ({friendid}) =>{

    const instance = useContext(InstanceContext);
    const userId = localStorage.getItem("userId");
    async function confirmRelation(){
        await instance.patch("/friend/invitation/confirm?userid="+userId+"&&friendid="+friendid,{},{ withCredentials: true,sameSite:false})
        .then(res=>console.log(res))
        .catch(err=>console.log(err));
    }

    return(
        <Button variant="success" style={{height:"50px",margin:"auto 10px"}} onClick={()=>confirmRelation()}>
            Przyjmij
        </Button>
    )
}
export default AcceptButton