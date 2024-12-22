import { Image, SafeAreaView, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { Input } from "../components/input";
import { Btn } from "../components/button";
import { Txt } from "../components/text";
import { Column } from "../components/arrangements";
import { useNavigation } from "@react-navigation/native";
import { useContext, useReducer, useState } from "react";
import { AuthContext } from "../hooks/auth.guard";
import { LoginModel } from "../api/models/login";
import { Error } from "../api/models/responses";
import { getErrorMsg } from "../utils";
import { BarAlert } from "../components/barAlert";

const LOGO = require('../assets/logo.png')

const style = StyleSheet.create({
    header: {
        backgroundColor: 'transparent'
    },
    gen: {
        padding: 25,
        alignItems: "center",
    },
    logo: {
        height: 100,
        resizeMode: "contain"
    },
})

export function SignInScreen(): React.JSX.Element {
    const nav = useNavigation();
    const { signin: signin }: AuthContext = useContext(AuthContext) as AuthContext;
    const [user, setUser] = useState({} as LoginModel);
    const [passForConfirm, setPassForConfirm] = useState('');
    const [error, dispatch] = useReducer(
        (_state: unknown, action: unknown) => {
            if (action == undefined) return;
            return action as Error;
        },
        {} as Error
    );

    return (
        <SafeAreaView style={{flex: 1}}>
            <Appbar.Header style={style.header}>
                <Appbar.BackAction onPress={() => nav.goBack()} />
            </Appbar.Header>
            <Column style={style.gen} gap={15}>
                <Image source={LOGO} style={style.logo}/>
                <Column>
                    <Txt bold size={32}>Sign In</Txt>
                    <Txt>Add your data to sign in.</Txt>
                </Column>
                <Column>
                    <Input type="email" onTxtChange={(txt) => user.email = txt} />
                    <Input type="password" label="Password" onTxtChange={(txt) => user.password = txt}/>
                    <Input type="password" label="Confirm password" onTxtChange={(txt) => setPassForConfirm(txt)}/>
                </Column>
                <Column>
                    <Btn title="Sign in" onPress={async () => {
                        const localError = validate(user, { confirmPass: passForConfirm });
                        if (localError) return dispatch(localError);
                        const data = await signin(user);
                        console.log(data);
                        
                        return dispatch(await signin(user));
                    }} />
                </Column>
            </Column>
            <BarAlert 
                text={error?.error ? getErrorMsg(error) : ""}
                type="error"
                visible={!!error?.error}
                onDismiss={() => dispatch(undefined)}/>
        </SafeAreaView>
    );
}

type Validations = {
    confirmPass: string,
}

function validate(user: LoginModel, validations: Validations): Error | undefined {
    if (validations.confirmPass != user.password) return {error: "Passwords error", message: "The passwords are different"};
    return undefined;
}