import {Power} from 'phosphor-react-native'
import {useUser, useApp} from "@realm/react";
import {TouchableOpacity} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import theme from "../../theme/index";
import {Container, Greeting, Message, Name, Picture} from './styles'

/**
 * Exibe o header do App
 * @constructor
 */
export function HomeHeader() {
    const user = useUser();
    const app = useApp();
    const insets = useSafeAreaInsets();


    function handleLogout() {
        app.currentUser?.logOut()
    }

    return (
        <Container style={{paddingTop: insets.top + 20}}>
            <Picture source={{uri: user?.profile.pictureUrl}}
                     placeholder="LSOpfGxb?bS0nNW-kCo4?^R+RPs."/>
            <Greeting>
                <Message>Olá</Message>
                <Name>{user?.profile.name}</Name>
            </Greeting>
            <TouchableOpacity activeOpacity={0.7}
                              onPress={handleLogout}>
                <Power size={32} color={theme.COLORS.GRAY_400}/>
            </TouchableOpacity>
        </Container>
    )
}
