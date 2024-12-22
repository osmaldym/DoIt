import { createContext, useEffect, useMemo, useReducer } from "react";
import { LoginModel, TokenModel } from "../api/models/login";
import { AppStorage } from "../App";
import { StorageKey } from "../enums/storage.enum";
import { AuthGuard as AuthGuardConsts } from "../enums/guard.enum";
import { deleteAccount, login, logout, signin } from "./auth";

export const AuthContext = createContext({});

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
            dispatch({ type: AuthGuardConsts.LOGIN, token: await login(user) });
        },
        signin: async (user) => {
            dispatch({ type: AuthGuardConsts.LOGIN, token: await signin(user) });
        },
        logout: () => {
            dispatch({ type: AuthGuardConsts.LOGOUT, token: logout() });
        },
        deleteAccount: async () => {
            dispatch({ type: AuthGuardConsts.LOGOUT, token: await deleteAccount() });
        },
    }), [])

    return [state, authContext]
}

export type AuthContext = {
    login: (user: LoginModel) => Promise<void>,
    signin: (user: LoginModel) => Promise<void>,
    logout: () => void,
    deleteAccount: () => Promise<void>,
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