import {forwardRef} from "react";
import {useTheme} from "styled-components";
import {Container, Input, Label} from "./styles";
import {TextInput, TextInputProps} from "react-native";

type Props = TextInputProps & {
    label: string
}

const TextAreaInput = forwardRef<TextInput, any>(({label, ...rest}, ref) => {
    const {COLORS} = useTheme()

    return (
        <Container>
            <Label>{label}</Label>
            <Input
                ref={ref}
                multiline
                autoCapitalize="sentences"
                placeholderTextColor={COLORS.GRAY_400}
                {...rest}/>
        </Container>
    )
});
export {TextAreaInput}

