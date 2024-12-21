import { NavigationContainer, Theme } from "@react-navigation/native";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogInScreen } from "../screens/login";
import { SignInScreen } from "../screens/signin";
import { PropsWithRef } from "react";
import AppRoutes from "../enums/routes.enum";
import { AuthContext, useAuthGuard } from "../hooks/auth.guard";
import { HomeScreen } from "../screens/home";
import { SplashScreen } from "../screens/splash";

const Stack = createNativeStackNavigator();

type AppNavProps = PropsWithRef<{
    theme?: Theme | any
}>

const opts: NativeStackNavigationOptions = {
    headerShown: false
}

export function AppNav(props: AppNavProps): React.JSX.Element {
    const [guard, authContext] = useAuthGuard();

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer theme={props.theme}>
                <Stack.Navigator screenOptions={opts}>
                    {
                        guard.loading ? (
                            <Stack.Screen name={AppRoutes.splashScreen} component={SplashScreen} />
                        ) : !guard.userToken ? (
                            <>
                                <Stack.Screen 
                                    name={AppRoutes.logIn}
                                    component={LogInScreen}
                                    options={{
                                        animationTypeForReplace: guard.logout ? 'pop' : 'push',
                                    }}
                                />
                                <Stack.Screen name={AppRoutes.signIn} component={SignInScreen} />
                            </>
                        ) : (
                            <Stack.Screen name={AppRoutes.home} component={HomeScreen} />
                        )
                    }
                </Stack.Navigator>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}