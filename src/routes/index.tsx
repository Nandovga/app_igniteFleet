import {NavigationContainer} from "@react-navigation/native"
import {AppRoutes} from "./app.routes";

/**
 * Realiza o controle das rotas da aplicação
 * @constructor
 */
export function Routes(){
    return (
        <NavigationContainer>
            <AppRoutes />
        </NavigationContainer>
    )
}
