import { useRouteError } from "react-router-dom";
import Card from 'react-bootstrap/Card';

const ErrorPage = ()=> {
  // const error = useRouteError();
  // console.error(error);

  return (
    <Card className="bg-dark text-white" style={{padding: '20px',margin:"auto"}}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {/* <i>{error.statusText || error.message}</i> */}
      </p>
    </Card>
  );
}
export default ErrorPage;