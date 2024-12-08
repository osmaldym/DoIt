import { Text } from "react-native-paper";
import { PropsWithChildren } from "react";
import { TextStyle } from "react-native";
import { AppTxtStyle } from "../theme/texts";

type TxtProps = PropsWithChildren<{
    style?: TextStyle;
    bold?: boolean;
    size?: number
}>;

export function Txt(props: TxtProps): React.JSX.Element {
    const mergedStyles: Array<TextStyle> = [
        AppTxtStyle,
        props.style!,
        {
            fontWeight: props.bold ? "bold" : "normal",
            fontSize: props.size ?? AppTxtStyle.fontSize
        }
    ]

    return (
        <Text style={mergedStyles}>{props.children}</Text>
    );
}