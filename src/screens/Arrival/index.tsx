import {Alert} from "react-native";
import {BSON} from "realm";
import {X} from "phosphor-react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import {useObject, useRealm} from "../../libs/realm";
import {Container, Label, Content, LicensePlate, Description, Footer} from './styles'

import {Header} from "../../components/Header";
import {Button} from "../../components/Button";
import {ButtonIcon} from "../../components/ButtonIcon";
import {Historic} from "../../libs/realm/schemas/Historic";

type RouteParamsProps = {
    id: string
}

/**
 * Tela de Chegada de veículo
 * @constructor
 */
export function Arrival() {
    const {goBack} = useNavigation()
    const route = useRoute();
    const {id} = route.params as RouteParamsProps

    const historic = useObject(Historic, new BSON.UUID(id) as unknown as string)
    const realm = useRealm()

    function handleRemoveVehicleUsage(){
        Alert.alert(
            'Cancelar',
            'Cancelar a utilização do veículo?',
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => removeVehicleUsage()},
            ]
        )
    }

    function removeVehicleUsage(){
        realm.write(() => {
            realm.delete(historic)
        })
        goBack();
    }

    function handleArrivalRegister(){
        try {
            if (!historic)
                return Alert.alert('Error', 'Não foi possível obter os dados para registrar a chegada do veículo.')
            realm.write(() => {
                historic.status = 'arrival';
                historic.updated_at = new Date();
            })
            Alert.alert('Chegada', 'Chegada realizada com sucesso!.')
            goBack();
        } catch (error){
            Alert.alert('Error', 'Não foi possível registrar a chegada do veículo.')
        }
    }

    return (
        <Container>
            <Header title="Chegada"/>
            <Content>
                <Label>Placa do Veículo</Label>
                <LicensePlate>{historic?.license_plate}</LicensePlate>
                <Label>Finalidade</Label>
                <Description>{historic?.description}</Description>
                <Footer>
                    <ButtonIcon icon={X}
                                onPress={handleRemoveVehicleUsage}/>
                    <Button title="Registrar Chegada"
                            onPress={handleArrivalRegister} />
                </Footer>
            </Content>
        </Container>
    )
}
