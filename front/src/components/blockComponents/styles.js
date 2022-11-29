import styled from "styled-components";
import {FaUserCircle} from 'react-icons/fa';

const styles = {

Photo : styled.img`
        width:50px;
        height: 50px;
        background-color: green;
        border-radius:0.5em;
        border:none;
        padding: 0.1em;
        margin: 0.5em;
    `,
UserIcon: styled(FaUserCircle)`
    width:40px;
    height: 40px;
    background-color: green;
    border-radius:0.5em;
    border:none;
    padding: 0.1em;
    margin: auto 0.5em;
    color:white;
`,
DateRowBlock:styled.div`
    width:100%;
    text-align:center;
    font-size:10px;
    margin-top:20px;
    display:block;
`,
DateRowElement:styled.span`
    position:relative;
    top: -25px;
    padding:0px 10px;
    background-color:#282c34;
`,
}

export default styles;