import { Image, ImageStyle, SafeAreaView, ViewStyle } from "react-native";
import { Input } from "../components/input";
import { Btn } from "../components/button";
import { Txt } from "../components/text";
import { Column } from "../components/arrangements";
import AppRoutes from "../enums/routes.enum";
import { useNavigation } from "@react-navigation/native";

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

    return (
        <SafeAreaView style={loginStyle}>
            <Image source={LOGO} style={logoStyle}/>
            <Column>
                <Txt bold size={32}>Log In</Txt>
                <Txt>Add your data to log in.</Txt>
            </Column>
            <Column>
                <Input type="email" />
                <Input type="password" label="Password"/>
            </Column>
            <Txt>Forgot your password?</Txt>
            <Column>
                <Btn />
            </Column>
            <Txt>
                Don't have an account?&nbsp;
                <Txt bold onPress={() => nav.navigate(AppRoutes.signIn as never)}>Sign in</Txt>
            </Txt>
        </SafeAreaView>
    );
}