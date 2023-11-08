import {Car} from "phosphor-react-native";
import {useEffect, useRef, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {Alert, ScrollView, TextInput} from "react-native";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {
    LocationAccuracy,
    LocationObjectCoords,
    LocationSubscription,
    useForegroundPermissions,
    watchPositionAsync,
    requestBackgroundPermissionsAsync
} from "expo-location";

import {useUser} from "@realm/react";
import {useRealm} from "../../libs/realm/index";
import {Historic} from "../../libs/realm/schemas/Historic";
import {Container, Content, Message} from './styles'

import {Map} from "../../components/Map";
import {Header} from "../../components/Header";
import {Button} from "../../components/Button";
import {Loading} from "../../components/Loading";
import {LocationInfo} from "../../components/LocationInfo";
import {TextAreaInput} from "../../components/TextAreaInput";
import {getAddressLocation} from "../../utils/getAddressLocation";
import {LicensePlateInput} from "../../components/LicensePlateInput";
import {licensePlateValidate} from "../../utils/licensePlateValidate";
import {startLocationTask} from "../../task/backgroundLocationTaks";

/**
 * Tela de Saída de veículo
 * @constructor
 */
export function Departure() {
    const [description, setDescription] = useState('');
    const [licensePlate, setLicensePlate] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [isLoadingLocation, setIsLoadingLocation] = useState(true)
    const [currentAddress, setCurrentAddress] = useState<string | null>(null)
    const [currentCoords, setCurrentCoords] = useState<LocationObjectCoords | null>(null)

    const [locationForegroundPermission, requestLocationForegroundPermission] = useForegroundPermissions()

    const {goBack} = useNavigation()
    const realm = useRealm();
    const user = useUser()

    const licensePlateRef = useRef<TextInput>(null)
    const descriptionRef = useRef<TextInput>(null)

    async function handleDepartureRegister() {
        try {
            if (!licensePlateValidate(licensePlate)) {
                licensePlateRef.current?.focus()
                return Alert.alert('Placa inválida', 'A placa é inválida. Por favor, informe a placa correta do veículo.')
            }
            if (description.trim().length === 0) {
                descriptionRef.current?.focus()
                return Alert.alert('Finalidade', 'Por favor, informe a finalidade da utilização do veículo.')
            }

            if (!currentCoords?.longitude && currentCoords?.longitude) {
                return Alert.alert('Localização', 'Não foi possível obter a localização atual.')
            }
            setIsRegistering(true)
            const backgroundPermissions = await requestBackgroundPermissionsAsync();
            if (!backgroundPermissions.granted) {
                setIsRegistering(false)
                return Alert.alert('Localização', 'É necessário permitir que App tenha acesso a localização em segundo plano. Acesse as configurações do dispositivo e habilite "Permitir o tempo todo"')
            }

            await startLocationTask()
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

    useEffect(() => {
        requestLocationForegroundPermission();
    }, []);

    useEffect(() => {
        if (!locationForegroundPermission?.granted)
            return;
        let subscriptions: LocationSubscription;
        watchPositionAsync({
            accuracy: LocationAccuracy.Highest,
            distanceInterval: 1,
            timeInterval: 1000
        }, (location) => {
            setCurrentCoords(location.coords)
            setIsLoadingLocation(false)
            getAddressLocation(location.coords)
                .then((address) => {
                    if (address)
                        setCurrentAddress(address)
                })
                .finally(() => setIsLoadingLocation(false))
        }).then(response => subscriptions = response)

        return () => {
            if (subscriptions)
                subscriptions.remove()
        };
    }, [locationForegroundPermission]);

    //Verificando a permissão de localização
    if (!locationForegroundPermission?.granted)
        return (
            <Container>
                <Header title="Saída"/>
                <Message>
                    Você precisa permitir que o aplicativo tenha acesso a localização para utilizar essa funcionalidade.
                    Por favor, acesse as configurações do seu dispositivo para conceder essa permissão ao aplicativo.
                </Message>
            </Container>
        )

    if (isLoadingLocation)
        return <Loading/>

    return (
        <Container>
            <Header title="Saída"/>
            <KeyboardAwareScrollView extraHeight={100}>
                <ScrollView>
                    {currentCoords && <Map coordinates={[currentCoords]} />}
                    <Content>
                        {currentAddress &&
                            <LocationInfo label="Localização Atual"
                                          description={currentAddress}
                                          icon={Car}/>}
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
