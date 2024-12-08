import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";
import { useColorScheme } from "react-native";

const lightTheme = {
    ...MD3LightTheme,
    colors: {
        ...MD3LightTheme.colors,
        primary: "#FF9D00",
    }
}

const darkTheme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: "#FF9D00",
    }
}

export const Theme: MD3Theme = useColorScheme() == 'dark' ? darkTheme : lightTheme;