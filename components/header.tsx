import React, { PropsWithoutRef, useContext } from 'react';
import { Appbar } from 'react-native-paper';
import { MenuContext } from './menu';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

type HeaderProps = PropsWithoutRef<{
    nativeStackProps: NativeStackHeaderProps,
    strictMenu?: boolean,
}>;

export function Header(props: HeaderProps) {
    const menu = useContext(MenuContext);

    return (
        <Appbar.Header>
            {
                props.nativeStackProps.back! && !props.strictMenu
                ? <Appbar.BackAction onPress={props.nativeStackProps.navigation.goBack} />
                : (
                    <>
                        <Appbar.Action
                            icon="menu"
                            size={28}
                            onPress={() => menu.current?.openDrawer()} />
                        <Appbar.Content title={ props.nativeStackProps.options.title! ?? 'Welcome' } />
                    </>
                )
            }
        </Appbar.Header>
    ) ;
}
