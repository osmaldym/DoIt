import { AppStorage } from "../App";
import { DoItApi } from "../api/DoIt";
import { LoginModel, TokenModel } from "../api/models/login";
import Api from "../enums/api.enum";
import { StorageKey } from "../enums/storage.enum";

export async function login(user: LoginModel) {
    const res = await DoItApi.post(Api.logIn, user);
    
    if (res.error) {
        console.error(res.error);
        return undefined;
    }

    const resData: TokenModel = res.data as TokenModel;
    AppStorage.set(StorageKey.access_token, resData.access_token);
    return resData.access_token;
}

export async function signin(user: LoginModel) {
    const res = await DoItApi.post(Api.signIn, user);

    if (res.error) {
        console.error(res.error);
        return undefined;
    }

    const resData: TokenModel = res.data as TokenModel;
    AppStorage.set(StorageKey.access_token, resData.access_token);
    return resData.access_token;
}

export function logout() {
    AppStorage.delete(StorageKey.access_token);
    return undefined;
}

export async function deleteAccount() {
    const res = await DoItApi.delete(Api.profile);
    
    if (res.error) {
        console.error(res.error);
        return undefined;
    }

    return logout();
}