import dayjs from "dayjs";
import {Alert, FlatList} from "react-native";
import {useEffect, useState} from "react";
import {Container, Content, Label, Title} from './styles'
import {useNavigation} from "@react-navigation/native";

import {useQuery, useRealm} from "../../libs/realm/index";
import {Historic} from "../../libs/realm/schemas/Historic";

import {CarStatus} from "../../components/CarStatus";
import {HomeHeader} from "../../components/HomeHeader";
import {HistoricCard, HistoricCardProps} from "../../components/HistoricCard";

/**
 * Exibe a tela Inicial do APP
 * @constructor
 */
export function Home() {
    const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null)
    const [vehicleHistoric, setVehicleHistoric] = useState<HistoricCardProps[]>([])

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
        try {
            const response = historic.filtered("status = 'arrival' SORT(created_at DESC)")
            const formattedHistoric = response.map((item) => {
                return ({
                    id: item._id!.toString(),
                    licensePlate: item.license_plate,
                    isSync: false,
                    created: dayjs(item.created_at).format('[Saída em] DD/MM/YYYY [ás] HH:mm')
                })
            })
            setVehicleHistoric(formattedHistoric)
        } catch (error) {
            console.log(error)
            Alert.alert('Histórico', 'Não foi possível carregar o histórico.');
        }
    }

    function handleHistoricDetails(id: string) {
        navigate('arrival', {id})
    }

    useEffect(() => {
        realm.addListener('change', () => fetchVehicleInUse());

        return () => {
            if (realm && !realm.isClosed)
                realm.removeListener('change', fetchVehicleInUse);
        }
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
                <Title>Histórico</Title>
                <FlatList data={vehicleHistoric}
                          keyExtractor={item => item.id}
                          renderItem={({item}) => (
                              <HistoricCard data={item}
                                            onPress={() => handleHistoricDetails(item.id)}/>
                          )}
                          showsVerticalScrollIndicator={false}
                          contentContainerStyle={{paddingBottom: 100}}
                          ListEmptyComponent={(
                              <Label>Nenhum veículo utilizado</Label>
                          )}/>
            </Content>
        </Container>
    )
}
