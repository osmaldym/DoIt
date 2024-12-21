import { createContext, useEffect, useMemo, useReducer } from "react";
import { LoginModel, TokenModel } from "../api/models/login";
import { AppStorage } from "../App";
import { StorageKey } from "../enums/storage.enum";
import { AuthGuard as AuthGuardConsts } from "../enums/guard.enum";
import { deleteAccount, login, logout, signin } from "./auth";

export const AuthContext = createContext({});

export const useAuthGuard = () => {
    const [state, dispatch] = useReducer(
        (prevState: any, action: any) => {
            switch (action.type) {
                case AuthGuardConsts.TOKEN:
                    return {
                        ...prevState,
                        userToken: action.token,
                        loading: false,
                    }

                case AuthGuardConsts.LOGIN:
                    return {
                        ...prevState,
                        userToken: action.token,
                        logout: false,
                    }

                case AuthGuardConsts.LOGOUT:
                    return {
                        ...prevState,
                        userToken: action.token,
                        logout: true,
                    }
            }  
        },
        {
            loading: true,
            logout: false,
            userToken: null,
        }
    )

    useEffect(() => {
        let userToken: TokenModel = { access_token: AppStorage.getString(StorageKey.access_token) ?? "" };
        dispatch({ type: AuthGuardConsts.TOKEN, token: userToken.access_token })
    }, [])

    const authContext: AuthContext = useMemo(() => ({
        login: async (user) => {
            dispatch({ type: AuthGuardConsts.LOGIN, userToken: await login(user) });
        },
        signin: async (user) => {
            dispatch({ type: AuthGuardConsts.LOGIN, userToken: await signin(user) });
        },
        logout: () => {
            dispatch({ type: AuthGuardConsts.LOGOUT, userToken: logout() });
        },
        deleteAccount: async () => {
            dispatch({ type: AuthGuardConsts.LOGOUT, userToken: await deleteAccount() });
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