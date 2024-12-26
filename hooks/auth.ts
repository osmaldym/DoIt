import { AppStorage } from "../App";
import { DoItApi } from "../api/DoIt";
import { UserModel, TokenModel } from "../api/models/user";
import Api from "../enums/api.enum";
import { StorageKey } from "../enums/storage.enum";

export async function login(user: UserModel) {
    const res = await DoItApi.post(Api.logIn, user);
    
    if (res.error) return res;

    const resData: TokenModel = res.data as TokenModel;
    AppStorage.set(StorageKey.access_token, resData.access_token);
    return resData.access_token;
}

export async function signin(user: UserModel) {
    const res = await DoItApi.post(Api.signIn, user);

    if (res.error) return res;

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
    
    if (res.error) return res

    return logout();
}