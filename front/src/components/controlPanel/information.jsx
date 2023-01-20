import controlPanelStyle from "./styles";

const {InformationBlock, EmailBlock} = controlPanelStyle;
const Information = ({users}) =>{
    
    return(
        <InformationBlock>
            <span>{users[0].firstname + " "+users[0].lastname}</span><br/>
            <EmailBlock>{users[0].name}</EmailBlock>
            <EmailBlock>{users[0].email}</EmailBlock>
        </InformationBlock>
    )
}
export default Information;