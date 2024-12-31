import { Button } from "react-native-paper";
import { PropsWithChildren } from "react";
import { GestureResponderEvent, TextStyle, TouchableHighlight, ViewStyle } from "react-native";
import { AppDefTheme, Theme } from "../theme/colors";

type ButtonProps = PropsWithChildren<{
    mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal",
    size?: number,
    icon?: string,
    title?: string,
    color?: string,
    rippleColor?: string,
    buttonColor?: string,
    noBg?: boolean,
    btnRight?: boolean,
    loading?: boolean,
    disabled?: boolean,
    onPress?: (e: GestureResponderEvent) => void,
    style?: ViewStyle,
    labelStyle?: ViewStyle,
}>;

const buttonStyle: ViewStyle = {
    borderRadius: 9999,
    overflow: "hidden"
}

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
            contentStyle={[{ flexDirection: props.btnRight ? 'row-reverse' : 'row' }, buttonStyle]}
            onPress={props.onPress}
            buttonColor={!props.noBg ? (props.buttonColor ?? AppDefTheme.colors.primary) : 'transparent'}
            background={{color: props.rippleColor}}
            style={[props.style, buttonStyle]}
            labelStyle={[props.labelStyle, labelStyle]}
        >
            {props.title ?? "Log in"}
        </Button>
    );
}