import { SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../components/text";

export function SplashScreen(): React.JSX.Element {
    return (
        <SafeAreaView>
            <Txt>Hello world from splash screen!</Txt>
        </SafeAreaView>
    )
} 