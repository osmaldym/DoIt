import { PropsWithRef } from "react";
import { ViewStyle } from "react-native";
import { Icon, Snackbar } from "react-native-paper";
import { Row } from "./arrangements";
import { Txt } from "./text";

type BarAlertProps = PropsWithRef<{
    type: 'info' | 'error' | 'success',
    text?: string,
    visible: boolean,
    onDismiss: () => void,
    duration?: number,
    style?: ViewStyle,
}>;

let snackBarStyle: ViewStyle = {}

export function BarAlert(props?: BarAlertProps): React.JSX.Element {
    let icon: string = '';
    let color: string = '';

    switch (props?.type){
        case 'error':
            icon = 'alert-outline';
            color = '#ff5a5a';
            break;
        case 'success':
            icon = 'check';
            color = '#68ff5a';
            break;
        default:
            icon = 'information-outline';
            color = '#000000';
    }
    
    snackBarStyle = { backgroundColor: color }

    return (
        <Snackbar
            duration={props?.duration ?? 3000}
            visible={props?.visible ?? true}
            onDismiss={props?.onDismiss ?? (()=>{})}
            style={[snackBarStyle, props?.style]}
            >
            <Row style={{ alignItems: "center" }}>
                <Icon source={icon} size={24} />
                <Txt style={{ flex: 1, color: "#000000" }}>{props?.text ?? "Hello World!"}</Txt>
            </Row>
        </Snackbar>
    )
}