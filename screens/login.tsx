import { Image, ImageStyle, SafeAreaView, ViewStyle } from "react-native";
import { Input } from "../components/input";
import { Btn } from "../components/button";
import { Txt } from "../components/text";
import { Column } from "../components/arrangements";
import AppRoutes from "../enums/routes.enum";
import { useNavigation } from "@react-navigation/native";
import { DoItApi } from "../api/DoIt";
import Api from "../enums/api.enum";
import { useState } from "react";
import { LoginModel, TokenModel } from "../api/models/login";
import { AppStorage } from "../App";
import { StorageKey } from "../enums/storage.enum";

const LOGO = require('../assets/logo.png')

const loginStyle: ViewStyle = {
    padding: 25,
    flex: 1,
    gap: 15,
    alignItems: "center",
}

const logoStyle: ImageStyle = {
    height: 100,
    resizeMode: "contain"
}

export function LogInScreen(): React.JSX.Element {
    const nav = useNavigation();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    return (
        <SafeAreaView style={loginStyle}>
            <Image source={LOGO} style={logoStyle}/>
            <Column>
                <Txt bold size={32}>Log In</Txt>
                <Txt>Add your data to log in.</Txt>
            </Column>
            <Column>
                <Input type="email" onTxtChange={(txt) => setEmail(txt)} />
                <Input type="password" label="Password" onTxtChange={(txt) => setPass(txt)}/>
            </Column>
            <Txt>Forgot your password?</Txt>
            <Column>
                <Btn onPress={async () => await login(email, pass)} />
            </Column>
            <Txt>
                Don't have an account?&nbsp;
                <Txt bold onPress={() => nav.navigate(AppRoutes.signIn as never)}>Sign in</Txt>
            </Txt>
        </SafeAreaView>
    );
}

async function login(email: string, pass: string) {
    const data: LoginModel = { email: email, password: pass, };
    const res = await DoItApi.post(Api.logIn, data);
    
    if (res.error) {
        console.error(res.error);
        return;
    }

    const resData: TokenModel = res.data as TokenModel;
    AppStorage.set(StorageKey.access_token, resData.access_token);
}