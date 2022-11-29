import styled from "styled-components"

const panelStyles ={
    PanelContainer: styled.div`
        width: 250px;
        height: 100vh;
        display: flex;
        flex-direction: column;
        
    `,
    ProfileContainer: styled.div`
        display:flex;
        &:hover {
            opacity:80%;
            cursor:pointer;
        };
    `,
    PhotoBlock : styled.img`
        width:40px;
        height: 40px;
        background-color: green;
        border-radius:0.5em;
        border:none;
        padding: 0.15em;
        margin: 0.1em 0.5em;
    `,
    InformationBlock: styled.div`
        height:50px;
        position: relative;               
        top: 50%;                      
        font-size: 15px;
    `,
    NameAndSurnameBlock: styled.span`
        display:block;
    `,
    EmailBlock: styled.span`
        display: block;
        font-size: 15px;
        color: gray;
    `,
}
export default panelStyles;

