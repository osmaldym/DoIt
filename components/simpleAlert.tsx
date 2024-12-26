import { Dialog, Portal } from "react-native-paper";
import { Txt } from "./text";
import { PropsWithChildren } from "react";
import { Btn } from "./button";
import { TextStyle } from "react-native";

type AlertProps = PropsWithChildren<{
    visible: boolean,
    onDismiss: () => unknown,
    title: string,
    content: string,
    type?: 'normal' | 'danger',
    onPressYes?: () => unknown,
    onPressNo?: () => unknown,
}>;

const titleStyles: TextStyle = {
    fontWeight: 'bold'
}

const dangerStyles: TextStyle = {
    color: 'red',
}

export function SimpleAlert(props: AlertProps) {
    return (
        <Portal>
            <Dialog visible={props.visible} onDismiss={props.onDismiss}>
                <Dialog.Title style={[titleStyles, props.type == 'danger' ? dangerStyles : undefined]}>{props.title}</Dialog.Title>
                <Dialog.Content>
                    <Txt>{props.content}</Txt>
                </Dialog.Content>
                <Dialog.Actions>
                    <Btn noBg title="No" onPress={props.onPressNo! ?? props.onDismiss} />
                    <Btn noBg title="Yes" color="red" onPress={props.onPressYes}/>
                    {props.children}
                </Dialog.Actions>
            </Dialog>
        </Portal>
    )
}