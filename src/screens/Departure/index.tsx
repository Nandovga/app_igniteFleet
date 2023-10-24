import {useRef} from "react";
import {KeyboardAvoidingView, Platform, ScrollView, TextInput} from "react-native";
import {Container, Content} from './styles'
import {Header} from "../../components/Header";
import {Button} from "../../components/Button";
import {TextAreaInput} from "../../components/TextAreaInput";
import {LicensePlateInput} from "../../components/LicensePlateInput";

const keyboardAvoidingViewBehavior = Platform.OS === "android" ? "height" : "position";

export function Departure() {
    const descriptionRef = useRef<TextInput>(null)

    function handleDepartureRegister() {
        console.log("ok")
    }

    return (
        <Container>
            <Header title="Saída"/>
            <KeyboardAvoidingView style={{flex: 1}} behavior={keyboardAvoidingViewBehavior}>
                <ScrollView>
                    <Content>
                        <LicensePlateInput
                            label="Placa do veículo"
                            placeholder="BRA1234"
                            onSubmitEditing={() => descriptionRef.current?.focus()}
                            returnKeyType="next"
                        />
                        <TextAreaInput
                            ref={descriptionRef}
                            label="Finalidade"
                            placeholder="Vou utilizar o veiculo para..."
                            onSubmitEditing={handleDepartureRegister}
                            returnKeyType="send"
                            blurOnSubmit
                        />
                        <Button
                            title="Registrar Saída"
                            onPress={handleDepartureRegister}
                        />
                    </Content>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    )
}
