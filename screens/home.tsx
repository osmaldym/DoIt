import { Appbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../components/text";

export function HomeScreen(): React.JSX.Element {
    return (
        <SafeAreaView>
            <Txt>Hello world from home!</Txt>
        </SafeAreaView>
    )
}