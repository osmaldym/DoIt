import React, { PropsWithChildren } from 'react';
import { Column } from './arrangements';
import { Icon } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { Txt } from './text';
import { AppDefTheme } from '../theme/colors';

type NoDataProps = PropsWithChildren<{
    title: string,
    size?: number,
    color?: string,
    icon?: string,
    noBold?: boolean,
    description?: string
}>;

const styles = StyleSheet.create({
    noDataProps: {
        flex: 1,
        marginBottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export function NoData(props: NoDataProps): React.JSX.Element {
    return (
        <Column style={styles.noDataProps}>
            <Icon
                source={props.icon ?? 'archive-off-outline'}
                color={props.color ?? AppDefTheme.colors.primary}
                size={props.size ?? 108}
            />
            <Txt center bold={!props.noBold} size={24}>{props.title}</Txt>
            {
                props.description ?
                    <Txt>{props.description}</Txt>
                : null
            }
            { props.children }
        </Column>
    );
}
