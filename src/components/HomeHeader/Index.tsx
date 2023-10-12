import {TouchableOpacity} from "react-native";
import {Power} from 'phosphor-react-native'
import theme from "../../theme/index";
import {Container, Greeting, Message, Name, Picture} from './styles'

export function HomeHeader() {
    return (
        <Container>
            <Picture source={{uri: 'https://github.com/Nandovga.png'}}
                     placeholder=""/>
            <Greeting>
                <Message>Olá</Message>
                <Name>Luiz Fernando</Name>
            </Greeting>
            <TouchableOpacity>
                <Power size={32} color={theme.COLORS.GRAY_400}/>
            </TouchableOpacity>
        </Container>
    )
}
