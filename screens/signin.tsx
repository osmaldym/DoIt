import { Image, ImageStyle, SafeAreaView, StyleSheet, ViewStyle } from "react-native";
import { Appbar } from "react-native-paper";
import { Input } from "../components/input";
import { Btn } from "../components/button";
import { Txt } from "../components/text";
import { Column } from "../components/arrangements";
import { useNavigation } from "@react-navigation/native";

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
                    <Input type="email" />
                    <Input type="password" label="Password"/>
                </Column>
                <Column>
                    <Btn />
                </Column>
            </Column>
        </SafeAreaView>
    );
}