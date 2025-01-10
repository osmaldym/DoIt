import { Text } from "react-native-paper";
import { PropsWithChildren } from "react";
import { GestureResponderEvent, TextStyle } from "react-native";
import { AppTxtStyle } from "../theme/texts";

type TxtProps = PropsWithChildren<{
    style?: TextStyle,
    bold?: boolean,
    center?: boolean,
    size?: number,
    numberOfLines?: number,
    onPress?: ((event: GestureResponderEvent) => void),
}>;

export function Txt(props: TxtProps): React.JSX.Element {
    const mergedStyles: Array<TextStyle> = [
        AppTxtStyle,
        {
            fontWeight: props.bold ? "bold" : "normal",
            textAlign: props.center ? 'center' : 'left',
            fontSize: props.size ?? AppTxtStyle.fontSize
        },
        props.style!,
    ]

    return (
        <Text style={mergedStyles} numberOfLines={props.numberOfLines} onPress={props.onPress}>{props.children}</Text>
    );
}