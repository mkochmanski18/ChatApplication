import styled from "styled-components";
import Card from 'react-bootstrap/Card';
import { Button } from "react-bootstrap";
import {BiLogOut} from 'react-icons/bi';

const styles = {

Message : styled.div`
    display:flex;
    margin: 10px;
`,
MessageText : styled(Card)`
    min-width: 150px;
    max-width:
    width:auto;
    padding: 0px 10px 5px 10px;
`,
DataBlock:styled.div`
    font-size: 10px;
    position:relative;
`,
ReceiverDateBlock : styled.div`
    margin-left: 15px;
`,
SenderDateBlock : styled.div`
    right: -120px;
`,
PhotoBlock : styled.img`
        width:50px;
        height: 50px;
        background-color: green;
        border-radius:0.5em;
        border:none;
        padding: 0.1em;
        margin: 0.5em;
    `,
ChatCard: styled(Card)`
    flex-grow:1;
    height:100vh;
`,
CardHeader: styled(Card.Header)`
    display:flex;
    justify-content:space-between;
`,
CardBody: styled(Card.Body)`
    display:flex;
    flex-direction:column;
    height:90%;
`,
LogoutButton: styled(Button)`
    width:25px;
    height:25px;
    padding:5px;
    display:block;
`,
LogoutIcon: styled(BiLogOut)`
    position:relative;
    top:-8px;
    right:2px;
`,
}

export default styles;