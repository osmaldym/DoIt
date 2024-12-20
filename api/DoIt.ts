import Config from "../config/environments";
import Api from "../enums/api.enum";
import HTTP from "../utils/http";
import { Success, Error } from "./models/responses";
import { catch_unwind } from "rusting-js";

export class DoItApi {
    static url: string = Config.URL ?? "";

    static async get(endpoint: Api, id?: string): Promise<Success & Error> {
        const urlEndpoint: string = this.url + endpoint + (id ?? "");
        let res = await catch_unwind(async () => (await HTTP.get(urlEndpoint)).json());
        return res.unwrap();
    }

    static async post(endpoint: Api, data: object): Promise<Success & Error> {
        const urlEndpoint: string = this.url + endpoint;
        const res = await catch_unwind(async () => (await HTTP.post(urlEndpoint, data)).json());
        return res.unwrap();
    }

    static async patch(endpoint: Api, id: string, data: object): Promise<Success & Error> {
        const urlEndpoint: string = this.url + endpoint + id;
        const res = await catch_unwind(async () => (await HTTP.patch(urlEndpoint, data)).json());
        return res.unwrap();
    }

    static async delete(endpoint: Api, id: string): Promise<Success & Error> {
        const urlEndpoint: string = this.url + endpoint + id;
        const res = await catch_unwind(async () => (await HTTP.delete(urlEndpoint)).json());
        return res.unwrap();
    }
}