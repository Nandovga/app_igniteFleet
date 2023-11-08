import {useEffect, useState} from "react";
import {BSON} from "realm";
import {Alert} from "react-native";
import {X} from "phosphor-react-native";
import {useObject, useRealm} from "../../libs/realm";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Container, Label, Content, LicensePlate, Description, Footer, AsyncMessage} from './styles'

import {Header} from "../../components/Header";
import {Button} from "../../components/Button";
import {ButtonIcon} from "../../components/ButtonIcon";
import {Historic} from "../../libs/realm/schemas/Historic";
import {stopLocationTask} from "../../task/backgroundLocationTaks";
import {getLastAsyncTimestamp} from "../../libs/asyncStorage/syncStorage";

type RouteParamsProps = {
    id: string
}

/**
 * Tela de Chegada de veículo
 * @constructor
 */
export function Arrival() {
    const [dataNotSynced, setDataNotSynced] = useState(false)
    const {goBack} = useNavigation()
    const route = useRoute();
    const {id} = route.params as RouteParamsProps

    const historic = useObject(Historic, new BSON.UUID(id) as unknown as string)
    const realm = useRealm()
    const title = historic?.status === 'departure' ? 'Chegada' : 'Detalhes'

    function handleRemoveVehicleUsage() {
        Alert.alert(
            'Cancelar',
            'Cancelar a utilização do veículo?',
            [
                {text: 'Não', style: 'cancel'},
                {text: 'Sim', onPress: () => removeVehicleUsage()},
            ]
        )
    }

    function removeVehicleUsage() {
        realm.write(() => {
            realm.delete(historic)
        })
        goBack();
    }

    async function handleArrivalRegister() {
        try {
            if (!historic)
                return Alert.alert('Error', 'Não foi possível obter os dados para registrar a chegada do veículo.')

            await stopLocationTask()
            realm.write(() => {
                historic.status = 'arrival';
                historic.updated_at = new Date();
            })

            Alert.alert('Chegada', 'Chegada realizada com sucesso!.')
            goBack();
        } catch (error) {
            Alert.alert('Error', 'Não foi possível registrar a chegada do veículo.')
        }
    }

    useEffect(() => {
        getLastAsyncTimestamp()
            .then(lastSync => setDataNotSynced(historic!.updated_at.getTime() > lastSync))
    }, []);

    return (
        <Container>
            <Header title={title}/>
            <Content>
                <Label>Placa do Veículo</Label>
                <LicensePlate>{historic?.license_plate}</LicensePlate>
                <Label>Finalidade</Label>
                <Description>{historic?.description}</Description>
            </Content>
            {historic?.status === "departure" && <Footer>
                <ButtonIcon icon={X}
                            onPress={handleRemoveVehicleUsage}/>
                <Button title="Registrar Chegada"
                        onPress={handleArrivalRegister}/>
            </Footer>}
            {dataNotSynced && <AsyncMessage>
                Sincronização da {historic?.status === "departure" ? "partida" : "chegada"} pendente.
            </AsyncMessage>}
        </Container>
    )
}
