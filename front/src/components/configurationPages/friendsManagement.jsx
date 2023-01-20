import SearchFriends from './friends/searchFriends';
import { NavLink, Routes,Route,useLocation } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import { Button } from 'react-bootstrap';
import Invitations from './friends/invitations';
import ActualFriends from './friends/actualFriends';
const FriendsManagement = () =>{

    const location = useLocation();
    return(
        <div style={{display:"block",flexGrow:1}}>

        <Nav style={{display:"flex",justifyContent:"center",marginTop:"20px"}}>
                                    
            <Nav.Item as={NavLink} to={"/chat/friendsmanagement/search"}> 
                <Button variant={location.pathname==="/chat/friendsmanagement/search"?"secondary":"dark"}>
                    Szukaj Znajomych
                </Button>
            </Nav.Item>
            <Nav.Item as={NavLink} to={"/chat/friendsmanagement/friends"}>
                <Button variant={location.pathname==="/chat/friendsmanagement/friends"?"secondary":"dark"}>
                    Moi Znajomi
                    </Button>
            </Nav.Item>
            <Nav.Item as={NavLink} to={"/chat/friendsmanagement/invitings"}>
                <Button variant={location.pathname==="/chat/friendsmanagement/invitings"?"secondary":"dark"}>
                    Zaproszenia
                </Button>
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