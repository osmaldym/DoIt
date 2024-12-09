import { NavigationContainer, Theme } from "@react-navigation/native";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogInScreen } from "../screens/login";
import { SignInScreen } from "../screens/signin";
import { PropsWithRef } from "react";
import AppRoutes from "../enums/routes.enum";

const Stack = createNativeStackNavigator();

type AppNavProps = PropsWithRef<{
    theme?: Theme | any
}>

const opts: NativeStackNavigationOptions = {
    headerShown: false
}

export function AppNav(props: AppNavProps): React.JSX.Element {
    return (
        <NavigationContainer theme={props.theme}>
            <Stack.Navigator screenOptions={opts}>
                <Stack.Screen name={AppRoutes.logIn} component={LogInScreen} />
                <Stack.Screen name={AppRoutes.signIn} component={SignInScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}