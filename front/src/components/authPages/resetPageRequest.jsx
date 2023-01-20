import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link} from 'react-router-dom';
import { useForm } from "react-hook-form";
import Card from 'react-bootstrap/Card';
import InstanceContext from '../context/instance/InstanceContext';

const ResetPageRequest = () =>{
    const instance = useContext(InstanceContext);
    const [response,setResponse] = useState();
    const onSubmit = async (data)=>{

        await instance.patch("/user/reset/"+data.email, 
        { withCredentials: true,sameSite:false})
        .then(function (response) {
            setResponse(response);
        })
        .catch(({response})=>{
            setResponse(response);
        })
    }

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    return(
        <Card className="bg-dark text-white" style={{padding: '20px',margin:"auto"}}>
            <Card.Header>Odzyskiwanie hasła</Card.Header>
            <div class="alert alert-info" role="alert">
               Po wysłaniu swojego adresu email, zostanie wygenerowana strona pozwalająca odzyskać hasło. ODnośnik do niej znajdziesz w swojej skrzynce pocztowej.
            </div>
            <Card.Body>
                <Form.Group controlId="formBasicEmail" style={{marginBottom:"25px"}}>
                        <Link to="/login" style={{textDecoration:"none",color:"yellow"}}>
                            Powrót do panelu logowania
                        </Link>
                    </Form.Group>
                
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
                    <Button className="mb-3" variant="success" type="submit" style={{width:"100%"}}>
                        Wyślij
                    </Button>
                    {
                        response && response.status && 
                        <div class={response.status===200?"alert alert-success":"alert alert-danger"}>
                                {console.log(response)}
                            {
                            response.status===200?"Wysłano wiadomość na wskazany adres":
                            response.status===404?"Użytkownik nie istnieje!":
                            response.status===500?"Błąd wczytania danych użytkownika!":null}
                        </div>
                    }
                    
                </Form>
            </Card.Body>
        </Card>
    )
}
export default ResetPageRequest