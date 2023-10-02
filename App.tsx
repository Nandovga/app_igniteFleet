import {ThemeProvider} from "styled-components";
import {useFonts, Roboto_400Regular, Roboto_700Bold} from "@expo-google-fonts/roboto";
import theme from "./src/theme";

import {SignIn} from "./src/screens/SignIn/Index";
import {Loading} from "./src/components/Loading/Index";
import {StatusBar} from "react-native";

export default function App() {
    const [fontsLoaded] = useFonts({Roboto_400Regular, Roboto_700Bold});

    return !fontsLoaded
        ? <Loading/>
        : <ThemeProvider theme={theme}>
            <StatusBar barStyle="light-content"
                       backgroundColor="transparent"
                       translucent/>
            <SignIn/>
        </ThemeProvider>
}

