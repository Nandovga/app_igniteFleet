import {useEffect, useState} from "react";
import {Container, Content} from './styles'
import {useNavigation} from "@react-navigation/native";

import {useQuery} from "../../libs/realm/index";
import {Historic} from "../../libs/realm/schemas/Historic";

import {CarStatus} from "../../components/CarStatus";
import {HomeHeader} from "../../components/HomeHeader";
import {Alert} from "react-native";

/**
 * Exibe a tela Inicial do APP
 * @constructor
 */
export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)
    const {navigate} = useNavigation()
    const historic = useQuery(Historic)

    function handleRegisterMoviment() {
        if (vehicleInUse?._id)
            return navigate('arrival', {id: vehicleInUse?._id.toString()});
        else
            return navigate('departure')
    }

    function fetchVehicle() {
        try {
            const vehicle = historic.filtered("status = 'departure'")[0]
            setVehicleInUse(vehicle)
        } catch (error) {
            Alert.alert('Veículo em uso', 'Não foi possível carregar o veículo em uso.')
        }
    }

    useEffect(() => {
        fetchVehicle()
    }, []);

    return (
        <Container>
            <HomeHeader/>
            <Content>
                <CarStatus
                    licensePlate={vehicleInUse?.license_plate}
                    onPress={handleRegisterMoviment}/>
            </Content>
        </Container>
    )
}
