import React from "react";
import { SafeAreaView } from "react-native";
import { Txt } from "../components/text";

export type TaskFormRoute = {
    id?: string,
}

export function TaskForm():  React.JSX.Element {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Txt>Hola</Txt>
        </SafeAreaView>
    )
}