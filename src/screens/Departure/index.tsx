import {useRef, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {Alert, ScrollView, TextInput} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {useUser} from "@realm/react";
import {useRealm} from "../../libs/realm/index";
import {Historic} from "../../libs/realm/schemas/Historic";

import {Container, Content} from './styles'
import {Header} from "../../components/Header";
import {Button} from "../../components/Button";
import {TextAreaInput} from "../../components/TextAreaInput";
import {LicensePlateInput} from "../../components/LicensePlateInput";
import {licensePlateValidate} from "../../utils/licensePlateValidate";

/**
 * Tela de Saída de veículo
 * @constructor
 */
export function Departure() {
    const [description, setDescription] = useState('');
    const [licensePlate, setLicensePlate] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)

    const {goBack} = useNavigation()
    const realm = useRealm();
    const user = useUser()

    const licensePlateRef = useRef<TextInput>(null)
    const descriptionRef = useRef<TextInput>(null)

    function handleDepartureRegister() {
        try{
            if (!licensePlateValidate(licensePlate)) {
                licensePlateRef.current?.focus()
                return Alert.alert('Placa inválida', 'A placa é inválida. Por favor, informe a placa correta do veículo.')
            }
            if (description.trim().length === 0) {
                descriptionRef.current?.focus()
                return Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilização do veículo.')
            }
            setIsRegistering(true)
            realm.write(() => {
                realm.create('Historic', Historic.generate({
                    user_id: user!.id,
                    license_plate: licensePlate.toUpperCase(),
                    description
                }))
            })

            Alert.alert('Saída', 'Saída do veículo registrada com sucesso!');
            goBack()
        } catch (error) {
            console.log(error)
            Alert.alert('Erro', 'Não foi possível registrar a saída do veículo.')
            setIsRegistering(false)
        }
    }

    return (
        <Container>
            <Header title="Saída"/>
            <KeyboardAwareScrollView extraHeight={100}>
                <ScrollView>
                    <Content>
                        <LicensePlateInput
                            ref={licensePlateRef}
                            label="Placa do veículo"
                            placeholder="BRA1234"
                            returnKeyType="next"
                            onSubmitEditing={() => descriptionRef.current?.focus()}
                            onChangeText={setLicensePlate}
                        />
                        <TextAreaInput
                            ref={descriptionRef}
                            label="Finalidade"
                            placeholder="Vou utilizar o veiculo para..."
                            returnKeyType="send"
                            blurOnSubmit
                            onSubmitEditing={handleDepartureRegister}
                            onChangeText={setDescription}
                        />
                        <Button
                            title="Registrar Saída"
                            onPress={handleDepartureRegister}
                            isLoading={isRegistering}
                        />
                    </Content>
                </ScrollView>
            </KeyboardAwareScrollView>
        </Container>
    )
}
