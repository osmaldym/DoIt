import { AppStorage } from "../App";
import { StorageKey } from "../enums/storage.enum";

export default class HTTP {
    static getHeaders: () => HeadersInit_ = () => ({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + AppStorage.getString(StorageKey.access_token) ?? "",  
    })

    static async get(url: string): Promise<any> {
        return await fetch(url, { headers: this.getHeaders() });
    }

    static async post(url: string, data: object): Promise<Response> {
        return await fetch(url, { method: 'POST', body: JSON.stringify(data), headers: this.getHeaders() });
    }

    static async patch(url: string, data: object): Promise<Response> {
        return await fetch(url, { method: 'PATCH', body: JSON.stringify(data), headers: this.getHeaders() });
    }

    static async delete(url: string): Promise<Response> {
        return await fetch(url, { method: 'DELETE', headers: this.getHeaders() });
    }
}