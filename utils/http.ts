import { Option } from 'rusting-js/enums';
import { AppStorage } from '../App';
import { Error } from '../api/models/responses';
import { StorageKey } from '../enums/storage.enum';
import Config from '../config/environments';

export default class HTTP {
    static getHeaders: () => HeadersInit_ = () => ({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + AppStorage.getString(StorageKey.access_token),
    });

    static readonly CANNOT_STABLISH_CONNECTION = 'Cannot stablish connection with the server';

    static anotherError(msg: Option<Error>): Error {
        const isNoStablishConn = msg.unwrap() as string === this.CANNOT_STABLISH_CONNECTION;

        return {
            error: isNoStablishConn ? 'Failed stablishing connection' : 'Unknown',
            message: isNoStablishConn ? [this.CANNOT_STABLISH_CONNECTION, 'Check the direction and port of ' + Config.URL + ' to solve this error'] : msg.unwrap(),
        } as Error;
    }

    static fetchTimeout(url: string, fetchConfig: object, timeout: number = 30000): Promise<unknown> {
        return Promise.race([
            fetch(url, fetchConfig),
            new Promise((_, reject) => setTimeout(() => reject(this.CANNOT_STABLISH_CONNECTION), timeout)),
        ]);
    }

    static async get(url: string): Promise<Response> {
        return this.fetchTimeout(url, { headers: this.getHeaders() } ) as Promise<Response>;
    }

    static async post(url: string, data: object): Promise<Response> {
        return this.fetchTimeout(url, { method: 'POST', body: JSON.stringify(data), headers: this.getHeaders() }) as Promise<Response>;
    }

    static async patch(url: string, data: object): Promise<Response> {
        return this.fetchTimeout(url, { method: 'PATCH', body: JSON.stringify(data), headers: this.getHeaders() }) as Promise<Response>;
    }

    static async put(url: string, data: object): Promise<Response> {
        return this.fetchTimeout(url, { method: 'PUT', body: JSON.stringify(data), headers: this.getHeaders() }) as Promise<Response>;
    }

    static async delete(url: string): Promise<Response> {
        return this.fetchTimeout(url, { method: 'DELETE', headers: this.getHeaders() }) as Promise<Response>;
    }
}
