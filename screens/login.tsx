import { Image, SafeAreaView, StyleSheet } from 'react-native';
import { Input } from '../components/input';
import { Btn } from '../components/button';
import { Txt } from '../components/text';
import { Column } from '../components/arrangements';
import AppRoutes from '../enums/routes.enum';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../hooks/auth.guard';
import { UserModel } from '../api/models/user';
import { BarAlert } from '../components/barAlert';
import { getErrorMsg } from '../utils';
import { useErrorReducer } from '../reducers/calls';

const LOGO = require('../assets/logo.png');

const styles = StyleSheet.create({
    maxContent: {
        flex: 1,
    },
    login: {
        padding: 25,
        flex: 1,
        gap: 15,
        alignItems: 'center',
    },
    logo: {
        height: 100,
        resizeMode: 'contain',
    },
});

export function LogInScreen(): React.JSX.Element {
    const nav = useNavigation();
    const { login } = useContext(AuthContext);
    const [user] = useState({} as UserModel);
    const [loading, setLoading] = useState(false);
    const [error, setErrorIfExist] = useErrorReducer();

    const runLogin = async () => {
        setLoading(true);
        setErrorIfExist(await login(user));
        setLoading(false);
    };

    return (
        <SafeAreaView style={styles.maxContent}>
            <Column style={styles.login}>
                <Image source={LOGO} style={styles.logo}/>
                <Column>
                    <Txt bold size={32}>Log In</Txt>
                    <Txt>Add your data to log in.</Txt>
                </Column>
                <Column>
                    <Input
                        type="email"
                        // eslint-disable-next-line no-return-assign
                        onTxtChange={(txt) => user.email = txt} />
                    <Input
                        type="password"
                        label="Password"
                        // eslint-disable-next-line no-return-assign
                        onTxtChange={(txt) => user.password = txt}/>
                </Column>
                <Column>
                    <Btn loading={loading} onPress={runLogin} />
                </Column>
                <Txt>
                    Don't have an account?&nbsp;
                    <Txt bold onPress={() => nav.navigate(AppRoutes.signIn as never)}>Sign in</Txt>
                </Txt>
            </Column>
            <BarAlert
                text={error?.error ? getErrorMsg(error) : ''}
                type="error"
                visible={!!error?.error}
                onDismiss={() => setErrorIfExist(undefined)}/>
        </SafeAreaView>
    ) ;
}
