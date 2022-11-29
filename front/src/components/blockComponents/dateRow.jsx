import styles from './styles';
const DateRow = ({messageData}) =>{
    const {DateRowBlock,DateRowElement} = styles;
    return(
        <DateRowBlock key={messageData?.messageId+"1"}>
            <hr color="white"></hr>
            <DateRowElement>
            {messageData.date}
            </DateRowElement> 
        </DateRowBlock>
    )
}
export default DateRow