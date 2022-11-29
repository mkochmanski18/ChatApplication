import { useState,useContext} from 'react';
import { useForm } from "react-hook-form";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import InstanceContext from '../context/instance/InstanceContext';

const RegisterPage = () =>{
    const instance = useContext(InstanceContext);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [pwd,setPwd] = useState();
    const [statusCode,setStatusCode] = useState();
    const onSubmit = data => {
        instance.post('/user/registration', {
            name:data.name,
            sex:data.gender,
            email:data.email,
            pwd:data.pwd
          }, { withCredentials: true })
          .then(function (response) {
                setStatusCode(201);
          })
          .catch(({response})=>{
                setStatusCode(response.status);
          })
    }
    const isExact = rpwd =>{
        return rpwd===pwd
    }

    return(
        <Card className="bg-dark text-white" style={{padding: '20px',margin:"auto"}}>
            <Card.Header>Panel Rejestracji</Card.Header>
            <Card.Body>
                <Form style={{margin:"auto"}} onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group  className="mb-3" controlId="formBasicData">
                        <Form.Control 
                            type="text" 
                            name="username"
                            placeholder="Imię i Nazwisko" 
                            {...register("username", { required: true })}
                        />
                        {
                            errors.username && 
                            <Form.Label style={{color:"firebrick"}}>Wpisz imię i nazwisko!</Form.Label>
                        }
                    </Form.Group>
                    <Form.Group  className="mb-3" controlId="formBasicName">
                        <Form.Control 
                            type="text" 
                            name="name"
                            {...register("name", { required: true })}
                            placeholder="Nazwa Użytkownika" 
                        />
                        <Form.Check 
                            type="checkbox" 
                            label="Używaj nazwy zamiast danych osobowych" 
                            style={{color:"gray"}} 
                        />
                        {
                            errors.name && 
                            <Form.Label style={{color:"firebrick"}}>Wpisz nazwę użytkownika!</Form.Label>
                        }
                    </Form.Group>
                    <Form.Group  className="mb-3" controlId="formBasicEmail">
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
                    <Form.Group 
                        className="mb-3" 
                        controlId="formBasicGender" 
                        style={{color:"gray"}} 
                        >
                        <Form.Label style={{color:'gray'}}>Wybierz swoją płeć</Form.Label>
                        <Form.Check 
                            type="radio" 
                            default 
                            value="man" 
                            label="Mężczyzna" 
                            name="gender"
                            checked
                            {...register("gender", { required: true })}
                        />
                        <Form.Check 
                            type="radio" 
                            value="women" 
                            label="Kobieta" 
                            name="gender"
                            {...register("gender", { required: true })}
                        />
                        <Form.Check 
                            type="radio" 
                            value="other" 
                            label="Inna"
                            name="gender" 
                            {...register("gender", { required: true })}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control 
                            type="password" 
                            placeholder="Hasło" 
                            name="pwd"
                            {...register("pwd", { required: true, minLength:8 })}
                            onChange={(e)=>setPwd(e.target.value)}
                        />
                        {
                            errors.pwd?.type==='required' && 
                            <Form.Label style={{color:"firebrick"}}>Wpisz hasło!</Form.Label>
                        }
                        {
                            errors.pwd?.type==='minLength' && 
                            <Form.Label style={{color:"firebrick"}}>Minimalna długość hasła to 8 znaków</Form.Label>
                        }
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPasswordRepeatition">
                        <Form.Control 
                            type="password" 
                            placeholder="Powtórz hasło"
                            name="rpwd"
                            {...register("rpwd", { required: true,validate:isExact })} 
                        />
                    {
                            errors.rpwd?.type === 'required' && 
                            <Form.Label style={{color:"firebrick"}}>Powtórz hasło!</Form.Label>
                        }
                    </Form.Group>
                    <Button 
                        className="mb-3" 
                        variant="success" 
                        type="submit" 
                        style={{width:"100%"}} 
                        >Zarejestruj
                    </Button>
                    {
                            errors.rpwd?.type === 'validate' && 
                            <Form.Label 
                                style={{color:"firebrick"}}>
                                    Hasła muszą być identyczne!
                            </Form.Label>
                    }
                    {
                        statusCode && <Form.Label
                            style={statusCode===201?{color:"green"}:{color:"firebrick"}}>
                            {
                            statusCode===201?"Utworzono konto!":
                            statusCode===406?"Użytkownik już istnieje!":
                            statusCode===409?"Nazwa zajęta":"Błąd wewnętrzny serwera!"}
                            </Form.Label>
                    }
                    <Form.Group>
                        <Form.Text>Masz już konto? </Form.Text>
                        <Link to="/login" style={{textDecoration:"none",color:"green"}}>
                            Zaloguj się
                        </Link>
                    </Form.Group>
                    
                </Form>
            </Card.Body>
        </Card>
    )
}
export default RegisterPage;