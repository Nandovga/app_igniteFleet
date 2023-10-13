import {createNativeStackNavigator} from "@react-navigation/native-stack"
import {Home} from "../screens/Home/Index";

const {Navigator, Screen} = createNativeStackNavigator();

/**
 * Realiza o controle das rotas (STACK)
 * - HOME
 * @constructor
 */
export function AppRoutes() {
    return (
        <Navigator screenOptions={{
            headerShown: false
        }}>
            <Screen name="home"
                    component={Home} />
        </Navigator>
    )
}
