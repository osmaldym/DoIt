import React, { PropsWithChildren } from "react";
import { Row } from "./arrangements";
import { StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from "react-native";
import { Txt } from "./text";
import { Modal as RNModal } from "react-native";

type ModalProps = PropsWithChildren<{
    visible: boolean,
    onClose: () => unknown,
    title?: string,
    actions?: React.JSX.Element,
    style?: ViewStyle | object,
    noDecoration?: boolean,
    noBorders?: boolean,
}>;

const styles = StyleSheet.create({
    allHeight: {
        flex: 1,
    },
    touchable: {
        backgroundColor: 'transparent',
    },
    grip: {
        backgroundColor: '#D9D9D9',
        height: 5,
        width: 50,
        marginBottom: 10,
        borderRadius: 10,
    },
    title: {
        flex: 1,
        marginBottom: 10,
    },
    modal: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 15,
        maxHeight: '50%',
        marginTop: 'auto',
        boxShadow: '0 0 30px #00000030'
    }
})

export function Modal(props: ModalProps): React.JSX.Element {
    return (
        <RNModal
            transparent
            animationType="slide"
            visible={props.visible}
            onRequestClose={props.onClose}
            >
            <TouchableWithoutFeedback style={styles.allHeight} onPress={props.onClose} >
                <View style={[styles.allHeight, styles.touchable]} />
            </TouchableWithoutFeedback>
            <View style={styles.modal}>
                <View style={styles.grip}></View>
                <Row>
                    { props.title ? <Txt bold size={32} style={styles.title}>{props.title}</Txt> : null }
                    { props.actions }
                </Row>
                {props.children}
            </View>
        </RNModal>
    )
}