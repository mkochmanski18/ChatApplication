import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link,useNavigate,useParams } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Card from 'react-bootstrap/Card';
import InstanceContext from '../context/instance/InstanceContext';

const ResetPage = () =>{
    const instance = useContext(InstanceContext);
    const [response,setResponse] = useState();
    const [pwd,setPwd] = useState();
    const param = useParams();
    const token = param.token;
    const onSubmit = async (data)=>{

        await instance.patch('/user/reset',{
            pwd:data.pwd,
            token
        }, { withCredentials: true,sameSite:false})
        .then(function (response) {
            setResponse(response);
        })
        .catch(({response})=>{
            setResponse(response);
        })
    }
    const isExact = rpwd =>{
        return rpwd===pwd
    }
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    return(
        <Card className="bg-dark text-white" style={{padding: '20px',margin:"auto"}}>
            <Card.Header>Odzyskiwanie hasła</Card.Header>
            <div class="alert alert-info" role="alert">
                Wpisz swoje nowe hasło, które ma zostać ustawione.
            </div>
            
            <Card.Body>
                <Form.Group controlId="formBasicEmail" style={{marginBottom:"25px"}}>
                        <Link to="/login" style={{textDecoration:"none",color:"yellow"}}>
                            Powrót do panelu logowania
                        </Link>
                    </Form.Group>
                
                <Form style={{margin:"auto"}} onSubmit={handleSubmit(onSubmit)}>
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
                    <Button className="mb-3" variant="success" type="submit" style={{width:"100%"}}>
                        Wyślij
                    </Button>
                    {
                            errors.rpwd?.type === 'validate' && 
                            <div class="alert alert-danger">
                                    Hasła muszą być identyczne!
                            </div>
                    }
                    {
                        response && response.status && 
                            <div
                                class={response.status===200?"alert alert-success":"alert alert-danger"}>
                                {
                                response.status===200?"Hasło zostało zmienione!":
                                response.status===403?"Błąd wczytania danych użytkownika!":
                                response.status===406?"Hasło aktualnie w użyciu!":
                                response.status===500?"Błąd wczytania danych użytkownika!":null}
                            </div>
                    }
                    
                </Form>
            </Card.Body>
        </Card>
    )
}
export default ResetPage;