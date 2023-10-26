import {Container, Label, Content, LicensePlate, Description, Footer} from './styles'
import {useRoute} from "@react-navigation/native";

import {Header} from "../../components/Header";
import {Button} from "../../components/Button";

type RouteParamsProps = {
    id: string
}

/**
 * Tela de Chegada de veículo
 * @constructor
 */
export function Arrival() {
    const route = useRoute();
    const {id} = route.params as RouteParamsProps

    return (
        <Container>
            <Header title="Chegada"/>
            <Content>
                <Label>Placa do Veículo</Label>
                <LicensePlate>FWE1G96</LicensePlate>
                <Label>Finalidade</Label>
                <Description>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque error et rem. Alias, ex
                    quisquam. Blanditiis deserunt, id! A amet dolor eligendi, id laboriosam laudantium minima natus odio
                    optio quidem.</Description>
                <Footer>
                    <Button title="Registrar Chegada" />
                </Footer>
            </Content>
        </Container>
    )
}
