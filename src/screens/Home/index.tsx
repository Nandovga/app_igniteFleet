import {Alert} from "react-native";
import {useEffect, useState} from "react";
import {Container, Content} from './styles'
import {useNavigation} from "@react-navigation/native";

import {useQuery, useRealm} from "../../libs/realm/index";
import {Historic} from "../../libs/realm/schemas/Historic";

import {CarStatus} from "../../components/CarStatus";
import {HomeHeader} from "../../components/HomeHeader";
import {HistoricCard} from "../../components/HistoricCard";

/**
 * Exibe a tela Inicial do APP
 * @constructor
 */
export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)
    const {navigate} = useNavigation()

    const historic = useQuery(Historic)
    const realm = useRealm()

    function handleRegisterMoviment() {
        if (vehicleInUse?._id)
            return navigate('arrival', {id: vehicleInUse?._id.toString()});
        else
            return navigate('departure')
    }

    function fetchVehicleInUse() {
        try {
            const vehicle = historic.filtered("status = 'departure'")[0]
            setVehicleInUse(vehicle)
        } catch (error) {
            Alert.alert('Veículo em uso', 'Não foi possível carregar o veículo em uso.')
        }
    }

    function fetchHistoric() {
        const response = historic.filtered("status = 'arrival' SORT(created_at DESC)")
        console.log(response)
    }

    useEffect(() => {
        realm.addListener('change', () => fetchVehicleInUse());

        return () => realm.removeListener('change', fetchVehicleInUse)
    }, []);

    useEffect(() => {
        fetchVehicleInUse()
    }, []);

    useEffect(() => {
        fetchHistoric();
    }, [historic]);

    return (
        <Container>
            <HomeHeader/>
            <Content>
                <CarStatus
                    licensePlate={vehicleInUse?.license_plate}
                    onPress={handleRegisterMoviment}/>
                <HistoricCard data={{created: '20/04', licensePlate: '1222222', isSync: false}}/>
            </Content>
        </Container>
    )
}
