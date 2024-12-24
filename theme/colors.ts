import { MD3DarkTheme, MD3LightTheme, MD3Theme, adaptNavigationTheme } from "react-native-paper";
import { DefaultTheme as RNDefaultTheme, DarkTheme as RNDarkTheme } from "@react-navigation/native";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationDark: RNDarkTheme,
    reactNavigationLight: RNDefaultTheme
})

export const AppDefTheme = {
    ...LightTheme,
    ...MD3LightTheme,
    colors: {
        ...LightTheme.colors,
        ...MD3LightTheme.colors,
        primary: "#FF9D00",
        onSecondaryContainer: "#000000",
    }
}

export const AppDarkTheme = {
    ...DarkTheme,
    ...MD3DarkTheme,
    colors: {
        ...DarkTheme.colors,
        ...MD3DarkTheme.colors,
        primary: "#FF9D00",
        onSecondaryContainer: "#000000",
    }
}

/**
 * Only sets a specific mode because setting dark/light mode 
 * generates an error and possibly bugs, in a future I need 
 * to use "state" and "context" to use the app with different
 * modes automatically and manually (By dark/light mode button)
 * cause I'm using "navigation", so now I decided only use the
 * light mode
 */
export const Theme: MD3Theme = AppDefTheme;