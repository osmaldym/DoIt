import { HttpStatus } from "../../enums/http.enum";

export class StatusCode {
    statusCode?: number;
}

export class Success implements StatusCode {
    statusCode?: number = HttpStatus.OK;
    data?: Object = {};
}

export class Error implements StatusCode {
    statusCode?: number = HttpStatus.BAD_REQUEST;
    error?: string = "Bad request";
    message?: Array<string> | string = "This is a bad request";
}