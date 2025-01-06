import { PropsWithChildren, useState } from "react";
import { Column, Row } from "./arrangements";
import { Txt } from "./text";
import { Platform, StyleSheet } from "react-native";
import { AppDefTheme } from "../theme/colors";
import { IconButton } from "react-native-paper";
import { Skeleton } from "./skeleton";

type TodoItemProps = PropsWithChildren<{
    title: string,
    onFlatList?: boolean,
    completed?: boolean,
    content?: string,
    onPressCompleted?: () => unknown,
    onPressEdit?: () => unknown,
    onPressRemove?: () => unknown,
}>;

const styles = StyleSheet.create({
    item: {
        padding: 15,
        borderColor: AppDefTheme.colors.primary,
        borderWidth: 2,
        borderRadius: 10,
        boxShadow: '0 0 20 rgba(0,0,0, 0.2)'
    },
    iconButton: {
        marginLeft: 0,
        marginRight: 0,
    },
    titleSection: {
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export function TodoItem(props: TodoItemProps): React.JSX.Element {
    const [checked, setChecked] = useState(props.completed ?? false);

    // This cause the `overflow: 'visible'` doesn't work in FlatList on android.
    let remBoxShadow;
    if (Platform.OS === 'android' && props.onFlatList) remBoxShadow = { boxShadow: '' };

    const rippleColor = AppDefTheme.colors.primary + '20' // Opacity in hex

    return (
        <Column style={[styles.item, remBoxShadow] as any}>
            <Row style={styles.titleSection}>
                <Txt size={22}>{props.title}</Txt>
                <Row gap={0}>
                    <IconButton 
                        iconColor={checked ? AppDefTheme.colors.primary : "#000000"}
                        icon="check"
                        rippleColor={rippleColor}
                        style={styles.iconButton}
                        onPressIn={() => setChecked(!checked)}
                        onPress={props.onPressCompleted}
                    />
                    <IconButton 
                        iconColor="#000000"
                        icon="pencil"
                        style={styles.iconButton}
                        rippleColor={rippleColor}
                        onPress={props.onPressEdit}
                    />
                    <IconButton 
                        iconColor="#000000" 
                        icon="delete"
                        style={styles.iconButton}
                        rippleColor={rippleColor}
                        onPress={props.onPressRemove}
                    />
                </Row>
            </Row>
            <Column>
                <Txt>{ props.content }</Txt>
            </Column>
        </Column>
    );
}

export function TodoItemSkeleton(): React.JSX.Element {
    return (
        <Column style={styles.item}>
            <Row style={styles.titleSection}>
                <Skeleton width={200} height={20} />
                <Row gap={0}>
                    <IconButton
                        disabled
                        icon="check"
                        style={styles.iconButton}
                        />
                    <IconButton
                        disabled
                        icon="pencil"
                        style={styles.iconButton}
                        />
                    <IconButton 
                        disabled
                        icon="delete"
                        style={styles.iconButton}
                        />
                </Row>
            </Row>
            <Column>
                <Skeleton height={14} />
                <Skeleton height={14} />
            </Column>
        </Column>
    );
}