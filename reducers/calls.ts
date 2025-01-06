import { useReducer } from "react";
import { Error } from "../api/models/responses";

export const useErrorReducer = () => useReducer(
    (_state: unknown, action: unknown | undefined) => {
        if (action == undefined) return;
        return action as Error;
    },
    {} as Error
);

export const useSuccessReducer = () => useReducer(
    (_state: unknown, action: string | undefined) => {
        if (action == undefined) return;
        return action;
    },
    ''
);