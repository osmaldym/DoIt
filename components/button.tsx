import { Button } from "react-native-paper";
import { PropsWithChildren } from "react";
import { ViewStyle } from "react-native";
import { Theme } from "../theme/colors";

type ButtonProps = PropsWithChildren<{
    title?: string,
    textColor?: string,
    buttonColor?: string,
    style?: ViewStyle,
}>;

export function Btn(props: ButtonProps): React.JSX.Element {
    return (
        <Button
            textColor={props.textColor ?? "#000"}
            mode="contained"
            buttonColor={props.buttonColor ?? Theme.colors.primary}
            style={[props.style]}
        >
            {props.title ?? "Log in"}
        </Button>
    );
}