
import Container from 'react-bootstrap/Container';
import LoginPage from './authPages/loginPage';
import RegisterPage from './authPages/registerPage';
import ErrorPage from './error-page';
import {
  Route,
  BrowserRouter,
  Routes,
  useNavigate
} from "react-router-dom";

import InstanceContext from './context/instance/InstanceContext';
import ChatContainer from './chatContainer';
import axios from 'axios';

function App() {
  
  const instance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 1000,
    headers: {'Access-Control-Allow-Origin':'*','withCredentials':true,'sameSite':false}
  });
  
  return (
    <div className="App">
      <Container fluid style={{display:"flex",minHeight:"100vh",height:"100%"}}>
        <InstanceContext.Provider value={instance}>
        <BrowserRouter>
          <Routes>
            <Route path="/login/*" element={<LoginPage/>}>
              
            </Route>
            <Route path="/registration" element={<RegisterPage/>}>
              
            </Route>
            <Route path="/chat/*" element={
                  <ChatContainer/>}>
            </Route>
            <Route path="*" element={<ErrorPage/>}>
            </Route>
          </Routes>
        </BrowserRouter>
        </InstanceContext.Provider>
      </Container>
    </div>
  );
}

export default App;
