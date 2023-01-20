import { useState,useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link,useNavigate,useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Card from 'react-bootstrap/Card';
import InstanceContext from '../context/instance/InstanceContext';
const LoginPage = () =>{
    const instance = useContext(InstanceContext);
    const [response,setResponse] = useState();
    const navigate = useNavigate();
    const param = useParams();
    const onSubmit = async (data)=>{

        await instance.post('/auth/login',{
            email:data.email,
            password:data.pwd,
        }, { withCredentials: true,sameSite:false})
        .then(function (response) {
            setResponse(response);
            localStorage.setItem("userId", response.data.userid);
        })
        .catch(({response})=>{
            setResponse(response);
        })
    }
    
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    return(
        <Card className="bg-dark text-white" style={{padding: '20px',margin:"auto"}}>
            <Card.Header>Panel Logowania</Card.Header>
            {param["*"]==="418"?<span style={{color:"firebrick"}}>Sesja wygasła. Zaloguj ponownie</span>:null}
            <Card.Body>
                
                <Form style={{margin:"auto"}} onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control 
                            type="email" 
                            placeholder="Email"
                            name="email"
                            {...register("email", { required: true })}
                        />
                        {
                            errors.email && 
                            <Form.Label style={{color:"firebrick"}}>Wpisz email!</Form.Label>
                        }
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control 
                            type="password" 
                            placeholder="Hasło"
                            name="pwd"
                            {...register("pwd", { required: true })}
                        />
                        {
                            errors.pwd && 
                            <Form.Label style={{color:"firebrick"}}>Wpisz hasło!</Form.Label>
                        }
                    </Form.Group>
                    <Button className="mb-3" variant="success" type="submit" style={{width:"100%"}}>
                        Zaloguj
                    </Button>
                    {
                        response && response.status && <Form.Label
                            style={response.status===201?{color:"green"}:{color:"firebrick"}}>
                                {console.log(response)}
                            {
                            response.status===201?navigate('/chat'):
                            response.status===401?"Błędne dane logowania!":
                            response.status===406?"Nazwa zajęta":null}
                            </Form.Label>
                    }
                    <Form.Group controlId="formBasicEmail">
                        <Form.Text>Nie posiadasz konta? </Form.Text>
                        <Link to="/registration" style={{textDecoration:"none",color:"green"}}>
                            Zarejestuj się
                        </Link>
                    </Form.Group>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Text>Nie pamiętasz hasła? </Form.Text>
                        <Link to="/resetrequest" style={{textDecoration:"none",color:"green"}}>
                            Odzyskaj hasło
                        </Link>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    )
}
export default LoginPage;