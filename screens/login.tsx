import { Image, ImageStyle, SafeAreaView, ViewStyle } from "react-native";
import { Input } from "../components/input";
import { Btn } from "../components/button";
import { Txt } from "../components/text";
import { Column } from "../components/arrangements";
import AppRoutes from "../enums/routes.enum";
import { useNavigation } from "@react-navigation/native";
import { useContext, useReducer, useState } from "react";
import { AuthContext } from "../hooks/auth.guard";
import { LoginModel } from "../api/models/login";
import { Error } from "../api/models/responses";
import { BarAlert } from "../components/barAlert";
import { getErrorMsg } from "../utils";

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
    const { login: login }: AuthContext = useContext(AuthContext) as AuthContext; 
    const [user, setUser] = useState({} as LoginModel);
    const [error, dispatch] = useReducer(
        (_state: unknown, action: unknown) => {
            if (action == undefined) return;
            return action as Error;
        },
        {} as Error
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Column style={loginStyle}>
                <Image source={LOGO} style={logoStyle}/>
                <Column>
                    <Txt bold size={32}>Log In</Txt>
                    <Txt>Add your data to log in.</Txt>
                </Column>
                <Column>
                    <Input type="email" onTxtChange={(txt) => user.email = txt} />
                    <Input type="password" label="Password" onTxtChange={(txt) => user.password = txt}/>
                </Column>
                <Column>
                    <Btn onPress={async () => dispatch(await login(user))} />
                </Column>
                <Txt>
                    Don't have an account?&nbsp;
                    <Txt bold onPress={() => nav.navigate(AppRoutes.signIn as never)}>Sign in</Txt>
                </Txt>
            </Column>
            <BarAlert 
                text={error?.error ? getErrorMsg(error) : ""}
                type="error"
                visible={!!error?.error}
                onDismiss={() => dispatch(undefined)}/>
        </SafeAreaView>
    );
}