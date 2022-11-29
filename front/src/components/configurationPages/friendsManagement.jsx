import SearchFriends from './friends/searchFriends';
import { NavLink, Routes,Route } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import { Button } from 'react-bootstrap';
import Invitations from './friends/invitations';
import ActualFriends from './friends/actualFriends';
const FriendsManagement = () =>{
    return(
        <div style={{display:"block",flexGrow:1}}>

        <Nav style={{display:"flex",justifyContent:"center"}}>
                                    
            <Nav.Item as={NavLink} to={"/chat/friendsmanagement/search"}>
                <Button variant="dark">Szukaj Znajomych</Button>
            </Nav.Item>
            <Nav.Item as={NavLink} to={"/chat/friendsmanagement/friends"}>
                <Button variant="dark">Moi Znajomi</Button>
            </Nav.Item>
            <Nav.Item as={NavLink} to={"/chat/friendsmanagement/invitings"}>
                <Button variant="dark">Zaproszenia</Button>
            </Nav.Item>
        </Nav>
        <Routes>
            <Route 
                path="/search" 
                element={
                    <SearchFriends/>
                }
            />
            <Route 
                path="/friends" 
                element={
                    <ActualFriends/>
                }
            />
            <Route 
                path="/invitings" 
                element={
                    <Invitations/>
                }
            />
        </Routes>
        
        </div>
    )
}
export default FriendsManagement;