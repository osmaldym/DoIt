import React, { PropsWithRef } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { Icon, Snackbar } from 'react-native-paper';
import { Row } from './arrangements';
import { Txt } from './text';

type BarAlertProps = PropsWithRef<{
    type: 'info' | 'error' | 'success',
    text?: string,
    visible: boolean,
    onDismiss: () => void,
    duration?: number,
    style?: ViewStyle,
}>;

let snackBarStyle: ViewStyle = {};

const styles = StyleSheet.create({
    txt: {
        flex: 1,
        color: '#000000',
    },
    alignCenter: {
        alignItems: 'center',
    },
});

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

    snackBarStyle = { backgroundColor: color };

    return (
        <Snackbar
            duration={props?.duration ?? 3000}
            visible={props?.visible ?? true}
            onDismiss={props?.onDismiss ?? (()=>{})}
            style={[snackBarStyle, props?.style]}
            >
            <Row style={styles.alignCenter}>
                <Icon source={icon} size={24} />
                <Txt style={styles.txt}>{props?.text ?? 'Hello World!'}</Txt>
            </Row>
        </Snackbar>
    );
}
