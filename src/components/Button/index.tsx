import {Container, Loading, Title} from "./styles";
import {TouchableOpacityProps} from "react-native";


type Props = TouchableOpacityProps & {
    title: string
    isLoading?: boolean
}

export function Button({title, isLoading = false, ...rest}: Props) {
    return (
        <Container
            activeOpacity={0.7}
            disabled={isLoading}
            {...rest}>
            {isLoading
                ? <Loading />
                : <Title>{title}</Title>}
        </Container>
    )
}