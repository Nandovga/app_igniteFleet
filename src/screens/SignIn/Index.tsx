import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

import {Container, Slogan, Title} from "./styles";
import {ANDROID_CLIENT_ID, IOS_CLIENT_ID} from "@env";
import backgroundImg from '../../assets/background.png'
import {Button} from "../../components/Button";
import {useEffect, useState} from "react";

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    const [_, response, googleSignIn] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        scopes: ['profile', 'email']
    })

    function handleGoogleSignIn() {
        setIsAuthenticating(true)
        googleSignIn().then((response) => {
            if (response.type !== "success")
                setIsAuthenticating(false)
        })
    }

    useEffect(() => {
        if (response?.type === "success")
            if (response.authentication?.idToken)
                console.log('TOKEN ' + response.authentication.idToken)
    }, [response]);

    return (
        <Container source={backgroundImg}>
            <Title>Ignite Fleet</Title>
            <Slogan>Gestão de uso de veículos</Slogan>

            <Button title="Entrar com google"
                    onPress={handleGoogleSignIn}
                    isLoading={isAuthenticating}/>
        </Container>
    );
}
