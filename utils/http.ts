export default class HTTP {
    static headers: HeadersInit_ = {
        "Content-Type": "application/json",
    }

    static async get(url: string): Promise<any> {
        return await fetch(url, { headers: this.headers });
    }

    static async post(url: string, data: object): Promise<Response> {
        return await fetch(url, { method: 'POST', body: JSON.stringify(data), headers: this.headers });
    }

    static async patch(url: string, data: object): Promise<Response> {
        return await fetch(url, { method: 'PATCH', body: JSON.stringify(data), headers: this.headers });
    }

    static async delete(url: string): Promise<Response> {
        return await fetch(url, { method: 'DELETE' });
    }
}