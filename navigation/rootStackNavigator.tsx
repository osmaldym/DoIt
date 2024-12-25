import { NavigationContainer, Theme } from "@react-navigation/native";
import { NativeStackNavigationOptions, createNativeStackNavigator } from "@react-navigation/native-stack";
import { LogInScreen } from "../screens/login";
import { SignInScreen } from "../screens/signin";
import { PropsWithRef, useRef } from "react";
import AppRoutes from "../enums/routes.enum";
import { AuthContext, GuardData, useAuthGuard } from "../hooks/auth.guard";
import { HomeScreen } from "../screens/home";
import { SplashScreen } from "../screens/splash";
import { Menu, MenuContext } from "../components/menu";
import { DrawerLayoutAndroid } from "react-native";
import { Header } from "../components/header";

const Stack = createNativeStackNavigator();

type AppNavProps = PropsWithRef<{
    theme?: Theme | any
}>

const opts: NativeStackNavigationOptions = {
    statusBarBackgroundColor: '#000',
    statusBarStyle: 'light',
}

export function AppNav(props: AppNavProps): React.JSX.Element {
    const [guard, authContext] = useAuthGuard();

    return (
        <AuthContext.Provider value={authContext}>
            <NavigationContainer theme={props.theme}>
                <MenuContext.Provider value={useRef<DrawerLayoutAndroid>(null)}>
                    <Menu>
                        <Stack.Navigator screenOptions={opts}>
                            {
                                (guard as GuardData).loading ? (
                                    <Stack.Screen 
                                        name={AppRoutes.splashScreen} 
                                        component={SplashScreen}
                                        options={{ headerShown: false, }}
                                        />
                                ) : !(guard as GuardData).userToken ? (
                                    <>
                                        <Stack.Screen 
                                            name={AppRoutes.logIn}
                                            component={LogInScreen}
                                            options={{
                                                headerShown: false,
                                                animationTypeForReplace: guard.logout ? 'pop' : 'push',
                                            }}
                                        />
                                        <Stack.Screen 
                                            name={AppRoutes.signIn}
                                            component={SignInScreen}
                                            options={{ header: (props) => <Header nativeStackProps={props} /> }}
                                            />
                                    </>
                                ) : (
                                    <Stack.Screen 
                                        name={AppRoutes.home}
                                        component={HomeScreen}
                                        options={{ header: (props) => <Header nativeStackProps={props} /> }}
                                        />
                                )
                            }
                        </Stack.Navigator>
                    </Menu>
                </MenuContext.Provider>
            </NavigationContainer>
        </AuthContext.Provider>
    )
}