import {Container, Title} from "./styles";
import {TouchableOpacity} from "react-native";
import {ArrowArcLeft} from "phosphor-react-native";
import {useTheme} from "styled-components";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";

type Props = {
    title: string
}

export function Header({title}: Props) {
    const {COLORS} = useTheme();
    const {goBack} = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <Container style={{paddingTop: insets.top + 20}}>
            <TouchableOpacity activeOpacity={0.7}
                              onPress={goBack}>
                <ArrowArcLeft size={24}
                              weight="bold"
                              color={COLORS.BRAND_LIGHT}/>
            </TouchableOpacity>
            <Title>{title}</Title>
        </Container>
    )
}
