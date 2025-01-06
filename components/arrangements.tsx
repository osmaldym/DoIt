import React, { PropsWithChildren } from "react";
import { FlexStyle, View, ViewStyle } from "react-native";

type ArregementProps = PropsWithChildren<{
    gap?: number,
    maxWidth?: number | 'auto',
    noStretch?: boolean,
    style?: ViewStyle | object,
}>

function getProps(props: ArregementProps, direction: FlexStyle["flexDirection"] = 'column'): ViewStyle {
    return {
        display: "flex",
        alignSelf: !props.noStretch ? "stretch" : 'auto',
        flexDirection: direction,
        maxWidth: props.maxWidth ?? 450,
        gap: props.gap! ?? 10
    }
}

export function Column(props: ArregementProps): React.JSX.Element {
    return (
        <View style={[getProps(props), props.style]}>{props.children}</View>
    )
}

export function Row(props: ArregementProps): React.JSX.Element {
    return (
        <View style={[getProps(props, 'row'), props.style]}>{props.children}</View>
    )
}
