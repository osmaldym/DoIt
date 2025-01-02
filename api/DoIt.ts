import Config from "../config/environments";
import Api from "../enums/api.enum";
import HTTP from "../utils/http";
import { Success, Error } from "./models/responses";
import { catch_unwind } from "rusting-js";

export class DoItApi {
    static url: string = Config.URL ?? "";

    static async get(endpoint: Api, data?: object): Promise<Success & Error>
    static async get(endpoint: Api, idOrVal?: string): Promise<Success & Error>
    static async get(endpoint: Api, idOrVal?: unknown): Promise<Success & Error> {
        let urlEndpoint: string = this.url + endpoint;

        if (typeof idOrVal == 'string') urlEndpoint += idOrVal
        if (typeof idOrVal == 'object') {
            urlEndpoint += '?'
            for (const [key, val] of Object.entries(idOrVal as any))
                urlEndpoint += `${key}=${val}&`;
            urlEndpoint = urlEndpoint.substring(0, urlEndpoint.length - 1);   
        }

        const res = await catch_unwind(async () => (await HTTP.get(urlEndpoint)).json());
        if (res.is_err()) return HTTP.anotherError(res.err());
        return res.unwrap();
    }

    static async post(endpoint: Api, data: object): Promise<Success & Error> {
        const urlEndpoint: string = this.url + endpoint;
        const res = await catch_unwind(async () => (await HTTP.post(urlEndpoint, data)).json());
        if (res.is_err()) return HTTP.anotherError(res.err());
        return res.unwrap();
    }

    static async patch(endpoint: Api, id: string, data: object): Promise<Success & Error> {
        const urlEndpoint: string = this.url + endpoint + id;
        const res = await catch_unwind(async () => (await HTTP.patch(urlEndpoint, data)).json());
        if (res.is_err()) return HTTP.anotherError(res.err());
        return res.unwrap();
    }

    static async put(endpoint: Api, data: object, id: string | undefined): Promise<Success & Error> {
        const urlEndpoint: string = this.url + endpoint + (id ?? "");
        const res = await catch_unwind(async () => (await HTTP.put(urlEndpoint, data)).json());
        if (res.is_err()) return HTTP.anotherError(res.err());
        return res.unwrap();
    }

    static async delete(endpoint: Api, id?: string): Promise<Success & Error> {
        const urlEndpoint: string = this.url + endpoint + (id ?? "");
        const res = await catch_unwind(async () => (await HTTP.delete(urlEndpoint)).json());
        if (res.is_err()) return HTTP.anotherError(res.err());
        return res.unwrap();
    }
}