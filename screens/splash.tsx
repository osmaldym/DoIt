import { SafeAreaView } from "react-native-safe-area-context";
import { Image, ImageStyle } from "react-native";

const LOGO = require('../assets/logo.png')

const logoStyle: ImageStyle = {
    height: 100,
    resizeMode: "contain"
}

export function SplashScreen(): React.JSX.Element {
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={LOGO} style={logoStyle}/>
        </SafeAreaView>
    )
} 