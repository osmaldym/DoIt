import { createContext, useEffect, useMemo, useReducer } from "react";
import { UserModel, TokenModel } from "../api/models/user";
import { AppStorage } from "../App";
import { StorageKey } from "../enums/storage.enum";
import { AuthGuard as AuthGuardConsts } from "../enums/guard.enum";
import { deleteAccount, login, logout, signin } from "./auth";

export const AuthContext = createContext({} as AuthContext);

export const useAuthGuard = () => {
    const defData: GuardData = { userToken: null, loading: false, logout: false };

    const [state, dispatch] = useReducer(
        (prevState: any, action: Action) => {
            const guardData: GuardData = {
                ...prevState,
                userToken: action.token
            };

            switch (action.type) {
                case AuthGuardConsts.TOKEN:
                    guardData.loading = false;
                    break;

                case AuthGuardConsts.LOGIN:
                    guardData.logout = false;
                    break;

                case AuthGuardConsts.LOGOUT:
                    guardData.logout = true;
                    break;
            }
            return guardData;
        },
        defData as any
    )

    useEffect(() => {
        let userToken: TokenModel = { access_token: AppStorage.getString(StorageKey.access_token) ?? "" };
        dispatch({ type: AuthGuardConsts.TOKEN, token: userToken.access_token })
    }, [])

    const authContext: AuthContext = useMemo(() => ({
        login: async (user) => {
            const res = await login(user); 
            if (typeof res != 'string') return res;
            dispatch({ type: AuthGuardConsts.LOGIN, token: res });
        },
        signin: async (user) => {
            const res = await signin(user); 
            if (typeof res != 'string') return res;
            dispatch({ type: AuthGuardConsts.LOGIN, token: res });
        },
        logout: () => {
            dispatch({ type: AuthGuardConsts.LOGOUT, token: logout() });
        },
        deleteAccount: async () => {
            const res = await deleteAccount();
            if (typeof res != 'undefined') return res;
            dispatch({ type: AuthGuardConsts.LOGOUT, token: res });
        },
    }), [])

    return [state, authContext]
}

export type AuthContext = {
    login: (user: UserModel) => Promise<unknown>,
    signin: (user: UserModel) => Promise<unknown>,
    logout: () => void,
    deleteAccount: () => Promise<unknown>,
}

export type GuardData = {
    userToken: string | null,
    loading: boolean,
    logout: boolean,
}

type Action = {
    type?: string,
    token?: string | undefined,
}