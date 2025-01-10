import { SafeAreaView } from "react-native-safe-area-context";
import { Txt } from "../components/text";
import { Column, Row } from "../components/arrangements";
import { TodoItem, TodoItemSkeleton } from "../components/todoItem";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { TaskModel } from "../api/models/task";
import React, { useEffect, useState } from "react";
import { DoItApi } from "../api/DoIt";
import Api from "../enums/api.enum";
import { useErrorReducer, useSuccessReducer } from "../reducers/calls";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AppRoutes from "../enums/routes.enum";
import { FAB } from "react-native-paper";
import { AppDefTheme } from "../theme/colors";
import { NoData } from "../components/noData";
import { TaskFormRoute } from "./taskForm";
import { getErrorMsg } from "../utils";
import { BarAlert } from "../components/barAlert";
import { SimpleAlert } from "../components/simpleAlert";

type TaskItemModel = {
    onPressEdit?: () => unknown;
    onPressRemove?: () => unknown;
    onPressCompleted?: () => unknown;
} & TaskModel

type DeleteTaskDialog = {
    show?: boolean,
    _id?: string,
}

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        zIndex: 99999,
    },
    title: {
        textTransform: 'capitalize',
    },
    col: {
        marginHorizontal: 20,
        flex: 1
    },
    flatList: {
        gap: 10,
    }
})

function getFormattedToday(): string {
    const today = new Date();
    const locale = "en"
    const localeGenerated = today.toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' });
    
    // Monday • 1 jan.
    const todayFormated = localeGenerated.replace(',', ' •') + '.'
    return todayFormated;
}

export function HomeScreen(): React.JSX.Element {

    // All variables and states
    const nav = useNavigation();
    const isFocused = useIsFocused();

    const [loading, setLoading] = useState(true);
    const [refreshing] = useState(false);
    const [deleteTaskDialog, setDeleteTaskDialog] = useState({} as DeleteTaskDialog);
    const [data, setData] = useState([] as TaskItemModel[]);

    const [error, setErrorIfExist] = useErrorReducer();
    const [success, setSuccessIfExist] = useSuccessReducer();

    const today = new Date().toISOString();

    // All functions that needs states
    const getTodayTasks = async () => {
        const res = await DoItApi.get(Api.tasks, { date: today, completed: false } as TaskModel);
        let todoItems: TaskItemModel[] = [];
        
        if (res.error!) {
            setErrorIfExist(res);
            return todoItems;
        }

        const resData = res.data as TaskModel[];
        
        for (const data of resData){
            const idParam: TaskFormRoute = { id: data._id };
            todoItems.push({
                ...data,
                onPressRemove: () => setDeleteTaskDialog( { show: true, _id: data._id }),
                onPressCompleted: () => setCompletedTask(data._id!),
                onPressEdit: () => nav.navigate(...[AppRoutes.taskForm, idParam] as never), // Don't judge me 🙏
            })
        } 
        
        return todoItems;
    }

    async function refreshTodayTasks() {
        setLoading(true);
        setData(await getTodayTasks());
        setLoading(false);
    }

    const removeTask = async (_id: string) => {
        const res = await DoItApi.delete(Api.tasks, _id);

        if (res.error){
            setErrorIfExist(res);
            return;
        }

        setSuccessIfExist('The task was deleted successfully');
        setDeleteTaskDialog({ show: false });
        setLoading(true);
        refreshTodayTasks();
    }

    const setCompletedTask = async (_id: string) => {
        const res = await DoItApi.patch(Api.tasks, _id, { completed: true });

        if (res.error){
            setErrorIfExist(res);
            return;
        }

        setSuccessIfExist('Task completed, ¡Congratulations!');
        setLoading(true);
        refreshTodayTasks();
    }
    
    useEffect(() => {
        isFocused && refreshTodayTasks();
    }, [isFocused]);

    const item = ({item, index}: {item: TaskItemModel, index: number}) => (
        <TodoItem
            key={index}
            title={item.title ?? ""}
            content={item.description ?? ""}
            onPressEdit={item.onPressEdit}
            onPressCompleted={item.onPressCompleted}
            onPressRemove={item.onPressRemove}
            onFlatList
        />
    )

    // Renderization
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FAB
                style={styles.fab}
                theme={{ colors: { primary: AppDefTheme.colors.primary } }}
                onPress={() => nav.navigate(AppRoutes.taskForm as never)}
                mode="flat"
                icon='plus'
            />
            <Column style={styles.col} gap={15}>
                <Txt style={styles.title} size={22}>{getFormattedToday()}</Txt>
                {
                    loading ?
                    <>
                        <TodoItemSkeleton />
                        <TodoItemSkeleton />
                        <TodoItemSkeleton />
                    </> : (
                        data!.length ?
                        <FlatList 
                            data={data}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={refreshTodayTasks}/>
                            }
                            contentContainerStyle={styles.flatList}
                            renderItem={item}
                            keyExtractor={task => task._id!}
                        /> :
                        <NoData 
                            icon="clipboard-text-off-outline"
                            title="No tasks for today."
                        >
                            <Row gap={0} maxWidth="auto" noStretch>
                                <Txt center>Add a new task </Txt>
                                <Txt center bold onPress={()=>nav.navigate(AppRoutes.taskForm as never)}>here</Txt>
                            </Row>
                        </NoData>
                    )
                }
            </Column>
            <BarAlert 
                text={error?.error ? getErrorMsg(error) : ""}
                type="error"
                visible={!!error?.error}
                onDismiss={() => setErrorIfExist(undefined)}
            />

            <BarAlert 
                text={success}
                type="success"
                visible={!!success}
                onDismiss={() => setSuccessIfExist(undefined)}
            />

            <SimpleAlert
                visible={deleteTaskDialog.show ?? false}
                onDismiss={() => setDeleteTaskDialog({ show: false })}
                type="danger"
                title="Delete task"
                content="Are you sure to delete this task?"
                onPressYes={() => removeTask(deleteTaskDialog._id!)}
                />
        </SafeAreaView>
    )
}