import { PropsWithRef } from "react";
import { ViewStyle } from "react-native";
import { Icon, Snackbar } from "react-native-paper";
import { Row } from "./arrangements";
import { Txt } from "./text";

type BarAlertProps = PropsWithRef<{
    type: 'info' | 'error',
    text?: string,
    visible: boolean,
    onDismiss: () => void,
    duration?: number,
    style?: ViewStyle,
}>;

let snackBarStyle: ViewStyle = {}

export function BarAlert(props?: BarAlertProps) {
    const color: string = props?.type == "error" ? '#ff5a5a':'#000000';
    
    snackBarStyle = { backgroundColor: color }

    return (
        <Snackbar
            duration={props?.duration ?? 3000}
            visible={props?.visible ?? true}
            onDismiss={props?.onDismiss ?? (()=>{})}
            style={[snackBarStyle, props?.style]}
            >
            <Row style={{ alignItems: "center" }}>
                <Icon source={props?.type == 'error' ? 'alert-outline' : 'information-outline'} size={24} />
                <Txt style={{ color: "#000000" }}>{props?.text ?? "Hello World!"}</Txt>
            </Row>
        </Snackbar>
    )
}