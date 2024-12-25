import { useReducer } from "react";
import { Error } from "../api/models/responses";

export const useErrorReducer = () => useReducer(
    (_state: unknown, action: unknown | undefined) => {
        if (action == undefined) return;
        return action as Error;
    },
    {} as Error
);