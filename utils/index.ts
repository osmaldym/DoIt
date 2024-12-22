import { Error } from "../api/models/responses";

export function getErrorMsg(response: Error) {
    let msg: string = "";
    if (Array.isArray(response.message)) msg = response.message[0];
    else msg = response.message ?? "";
    return msg.charAt(0).toUpperCase() + msg.slice(1);
}