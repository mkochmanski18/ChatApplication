import { Button } from "react-bootstrap";
import { useState,useContext } from "react";
import InstanceContext from "../../context/instance/InstanceContext";
import onSearch from '../../services/functions/onSearch';
import UserTile from "../../blockComponents/userTile";

const SearchFriends = () =>{
    const [search,setSearch] = useState();
    const [searchResult,setSearchResult] = useState([]);
    const instance = useContext(InstanceContext);

    return(
        <div style={{flexGrow:1,height:"100vh"}}>
            <div style={{ display:'flex',justifyContent:'center'}}>
                <input 
                    type="text" 
                    name="search" 
                    onChange={e=>{setSearch(e.target.value)}} 
                    placeholder="Imię, nazwa użytkownika lub fraza" 
                    style={{width:"300px",margin:"10px 10px"}}/>
                <Button style={{width:"100px",height:"50%",marginTop:"6px"}} onClick={()=>onSearch(instance,search,setSearchResult)}>Szukaj</Button>
            </div>
            <div>
                {searchResult.map(user=>{
                    
                    return(
                        <UserTile user={user}/>
                    )
                })}
            </div>
        </div>
    )
}
export default SearchFriends;