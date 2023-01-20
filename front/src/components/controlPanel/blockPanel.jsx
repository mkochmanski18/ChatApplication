import Profile from "./profile";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import {Button} from 'react-bootstrap'
import { useEffect, useState,useContext } from "react";
import UserPhoto from "../blockComponents/userPhoto";

import { NavLink } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import InstanceContext from "../context/instance/InstanceContext";
import {FaUserFriends,FaUserAlt,FaUserEdit} from 'react-icons/fa';
import GroupConversationProfile from "./grupConversationProfile";

const BlockPanel = ({conversations}) =>{
    const instance = useContext(InstanceContext);
    const [currentConversationsType,setCurrentConversationsType] = useState(0);
    const [userData,setUserData] = useState();

    async function fetchUserData(userId){
        await instance.get("/user/search/id/"+userId, { withCredentials: true,sameSite:false})
        .then(res=>setUserData(res.data))
        .catch(res=>console.log(res));
    }
    useEffect(()=>{
        const userId = localStorage.getItem("userId");
        fetchUserData(userId);
    },[])
    return(
        <>
        <Card className="bg-dark text-white" style={{minWidth:"250px",width:'auto',maxHeight:"100vh"}}>
            <Card.Header style={{display:"flex"}}>
                {userData &&<UserPhoto userData={userData}/>}
                {userData&& 
                    <div style={{display:"flex",flexDirection:"column",padding: "5px"}}>
                    <span>{userData.firstname + " "+userData.lastname}</span>
                    <span>{userData.email}</span>
                    </div>}
            </Card.Header>
            {conversations&&
            <Card.Body>
                <div style={{display:"flex",justifyContent:"space-around"}}>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Znajomi</Tooltip>}>
                        <Button onClick={()=>setCurrentConversationsType(0)} className="mb-3 bg-transparent text-white border-dark"><FaUserAlt size="20" color="gray"/></Button>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Grupy</Tooltip>}>
                        <Button onClick={()=>setCurrentConversationsType(1)} className="mb-3 bg-transparent text-white border-dark"><FaUserFriends size="30" style={{position:"relative",top:'2px',color:"gray"}}/></Button>
                    </OverlayTrigger>
                    <OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Zarządzanie</Tooltip>}>
                        <Navbar variant="dark" bg="dark" expand="sm" style={{top:"-7px"}}>
                                <Nav>
                                    <NavDropdown
                                    id="nav-dropdown-dark-example"
                                    title={<FaUserEdit size="25" color="gray"/>}
                                    menuVariant="dark"
                                    >
                                    <NavDropdown.Item as={NavLink} to={"/chat/friendsmanagement"}>
                                        <FaUserAlt/> Zarządzaj Znajomymi
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to={"/chat/groupsmanagement"}>
                                        <FaUserFriends/> Zarządzaj Grupami
                                    </NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                        </Navbar>
                    </OverlayTrigger>
                </div>
                <ListGroup variant="flush">
                    {conversations.map(conversation=>{
                        return(
                            <>
                            {conversation.conversationType===currentConversationsType?
                            <ListGroup.Item className="bg-transparent text-white" key={conversation.conversationId}>
                                {conversation.conversationType===0?
                                <Profile conversation={conversation}/>:
                                <GroupConversationProfile conversation={conversation}/>}
                                
                            </ListGroup.Item>:null}</>
                        )
                    })}
                    
                </ListGroup>
            </Card.Body>
            }
        </Card>

        </>
        )
}

export default BlockPanel;