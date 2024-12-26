import { Image, SafeAreaView, StyleSheet } from "react-native";
import { Input } from "../components/input";
import { Btn } from "../components/button";
import { Txt } from "../components/text";
import { Column } from "../components/arrangements";
import { useContext, useReducer, useState } from "react";
import { AuthContext } from "../hooks/auth.guard";
import { LoginModel } from "../api/models/login";
import { Error } from "../api/models/responses";
import { getErrorMsg } from "../utils";
import { BarAlert } from "../components/barAlert";
import { useErrorReducer } from "../reducers/calls";

const LOGO = require('../assets/logo.png')

const style = StyleSheet.create({
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
    const { signin } = useContext(AuthContext);
    const [user] = useState({} as LoginModel);
    const [loading, setLoading] = useState(false);
    const [passForConfirm, setPassForConfirm] = useState('');
    const [error, setErrorIfExist] = useErrorReducer();

    const runSignin = async () => {
        setLoading(true)
        const localError = validate(user, { confirmPass: passForConfirm })
        setErrorIfExist(localError ?? await signin(user))
        setLoading(false)
    }

    return (
        <SafeAreaView style={{flex: 1}}>
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
                    <Btn loading={loading} title="Sign in" onPress={runSignin} />
                </Column>
            </Column>
            <BarAlert 
                text={error?.error ? getErrorMsg(error) : ""}
                type="error"
                visible={!!error?.error}
                onDismiss={() => setErrorIfExist(undefined)}/>
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