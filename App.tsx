import {StatusBar} from "react-native";
import {ThemeProvider} from "styled-components";
import {AppProvider, UserProvider} from "@realm/react"
import {useFonts, Roboto_400Regular, Roboto_700Bold} from "@expo-google-fonts/roboto";

import {REALM_APP_ID} from "@env";
import theme from "./src/theme";
import {Home} from "./src/screens/Home/Index";
import {SignIn} from "./src/screens/SignIn/Index";
import {Loading} from "./src/components/Loading/Index";

export default function App() {
    const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold});

    return !fontsLoaded
        ? <Loading/>
        : <AppProvider id={REALM_APP_ID}>
            <ThemeProvider theme={theme}>
                <StatusBar barStyle="light-content"
                           backgroundColor="transparent"
                           translucent/>
                <UserProvider fallback={SignIn}>
                    <Home />
                </UserProvider>
            </ThemeProvider>
        </AppProvider>
}

