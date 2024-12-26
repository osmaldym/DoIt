import { Button } from "react-native-paper";
import { PropsWithChildren } from "react";
import { GestureResponderEvent, TextStyle, ViewStyle } from "react-native";
import { Theme } from "../theme/colors";

type ButtonProps = PropsWithChildren<{
    mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal",
    size?: number,
    icon?: string,
    title?: string,
    color?: string,
    buttonColor?: string,
    noBg?: boolean,
    loading?: boolean,
    disabled?: boolean,
    onPress?: (e: GestureResponderEvent) => void,
    style?: ViewStyle,
    labelStyle?: ViewStyle,
}>;

export function Btn(props: ButtonProps): React.JSX.Element {
    const labelStyle: TextStyle = {
        fontSize: props.size,
    }

    return (
        <Button
            textColor={props.color ?? "#000"}
            loading={props.loading}
            disabled={props.loading ?? props.disabled}
            mode={props.noBg ? 'text' : (props.mode ?? "contained")}
            icon={props.icon}
            onPress={props.onPress}
            buttonColor={!props.noBg ? (props.buttonColor ?? Theme.colors.primary) : 'transparent'}
            style={[props.style]}
            labelStyle={[props.labelStyle, labelStyle]}
        >
            {props.title ?? "Log in"}
        </Button>
    );
}