import { Icon } from "react-native-paper";
import { Column } from "../components/arrangements";
import { SafeAreaView, ViewStyle } from "react-native";
import { Txt } from "../components/text";
import { Skeleton } from "../components/skeleton";
import { Btn } from "../components/button";
import { Dispatch, useContext, useEffect, useState } from "react";
import { AuthContext } from "../hooks/auth.guard";
import { DoItApi } from "../api/DoIt";
import Api from "../enums/api.enum";
import { BarAlert } from "../components/barAlert";
import { getErrorMsg } from "../utils";
import { useErrorReducer } from "../reducers/calls";
import { ProfileModel } from "../api/models/profile";
import { SimpleAlert } from "../components/simpleAlert";

type DialogShown = {
    logout?: boolean,
    deleteAccount?: boolean,
}

const columnStyle: ViewStyle = {
    alignItems: 'center',
    paddingHorizontal: 15,
}

async function getProfile(err: Dispatch<unknown>): Promise<ProfileModel> {
    const res = await DoItApi.get(Api.profile);
    if (res.error) err(res);
    return res.data as ProfileModel;
}

export function ProfileScreen(): React.JSX.Element {
    const { logout, deleteAccount } = useContext(AuthContext);
    
    const [userEmail, setUserEmail] = useState("");    
    const [dialogShown, setShowDialog] = useState({} as DialogShown)
    const [loading, setLoading] = useState(false)
    
    const [error, setErrorIfExist] = useErrorReducer();
    
    useEffect(() => {
        getProfile(setErrorIfExist).then(el => setUserEmail(el.email ?? ""));
    }, [userEmail])

    const runLogout = () => {
        setLoading(true);
        logout();
        setLoading(false);
    }

    const runDeleteAccount = async () => {
        setLoading(true);
        setErrorIfExist(await deleteAccount())
        setLoading(false);
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <Column style={columnStyle}>
                <Icon size={150} source="account-circle-outline"/>
                { !userEmail ? <Skeleton /> : <Txt bold size={28}>{userEmail}</Txt> }
                <Column style={{alignItems: 'flex-start'}}>
                    <Btn loading={loading} noBg icon="logout" title="Logout" size={20} 
                        onPress={() => setShowDialog({ logout: true })} />
                    <Btn loading={loading} noBg icon="delete" title="Delete account" size={20} color="red" 
                        onPress={() => setShowDialog({ deleteAccount: true })}/>
                </Column>
            </Column>

            <SimpleAlert 
                visible={dialogShown.logout!} 
                onDismiss={() => setShowDialog({ logout: false })}
                title="Logout"
                content="Are you sure?"
                onPressYes={runLogout}
                />

            <SimpleAlert
                visible={dialogShown.deleteAccount!}
                onDismiss={() => setShowDialog({ deleteAccount: false })}
                type="danger"
                title="Delete account"
                content="Are you sure for delete the account? This action is irreversible"
                onPressYes={runDeleteAccount}
                />

            <BarAlert 
                text={error?.error ? getErrorMsg(error) : ""}
                type="error"
                visible={!!error?.error}
                onDismiss={() => setErrorIfExist(undefined)}/>
        </SafeAreaView>
    );
}