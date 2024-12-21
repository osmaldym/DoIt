import { Image, SafeAreaView, StyleSheet } from "react-native";
import { Appbar } from "react-native-paper";
import { Input } from "../components/input";
import { Btn } from "../components/button";
import { Txt } from "../components/text";
import { Column } from "../components/arrangements";
import { useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import { AuthContext } from "../hooks/auth.guard";
import { LoginModel } from "../api/models/login";

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

    return (
        <SafeAreaView>
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
                        const validated: boolean = validate(user, { confirmPass: passForConfirm });
                        if (!validated) return;
                        await signin(user);
                    }} />
                </Column>
            </Column>
        </SafeAreaView>
    );
}

type Validations = {
    confirmPass: string,
}

function validate(user: LoginModel, validations: Validations): boolean {
    let isAllRight: boolean = true;

    if (validations.confirmPass != user.password) {
        console.error("The passwords are different");
        isAllRight = false;
    }
    
    return isAllRight;
}