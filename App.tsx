import 'react-native-get-random-values'
import './src/libs/dayjs/index'
import {REALM_APP_ID} from "@env";
import {StatusBar} from "react-native";
import {WifiSlash} from "phosphor-react-native";
import {ThemeProvider} from "styled-components";
import {AppProvider, UserProvider} from "@realm/react"
import {SafeAreaProvider} from "react-native-safe-area-context";
import {useFonts, Roboto_400Regular, Roboto_700Bold} from "@expo-google-fonts/roboto";
import {useNetInfo} from "@react-native-community/netinfo";

import theme from "./src/theme";
import {Routes} from "./src/routes";
import {SignIn} from "./src/screens/SignIn";
import {Loading} from "./src/components/Loading";
import {TopMessage} from "./src/components/TopMessage";
import {RealmProvider, syncConfig} from "./src/libs/realm";

/**
 * Ponto de entrada do APP
 * @constructor
 */
export default function App() {
    const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold});
    const netInfo = useNetInfo()

    return !fontsLoaded
        ? <Loading/>
        : <AppProvider id={REALM_APP_ID}>
            <ThemeProvider theme={theme}>
                <SafeAreaProvider style={{flex: 1, backgroundColor: theme.COLORS.GRAY_800}}>
                    <StatusBar barStyle="light-content"
                               backgroundColor="transparent"
                               translucent/>
                    {!netInfo.isConnected &&
                        <TopMessage title="Você está off-line"
                                    icon={WifiSlash}/>}
                    <UserProvider fallback={SignIn}>
                        <RealmProvider sync={syncConfig}
                                       fallback={Loading}>
                            <Routes/>
                        </RealmProvider>
                    </UserProvider>
                </SafeAreaProvider>
            </ThemeProvider>
        </AppProvider>

}

