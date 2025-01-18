import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Txt } from '../components/text';
import { TaskModel } from '../api/models/task';
import { TagModel } from '../api/models/tag';
import { useErrorReducer, useSuccessReducer } from '../reducers/calls';
import { DoItApi } from '../api/DoIt';
import Api from '../enums/api.enum';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import AppRoutes from '../enums/routes.enum';
import { TodoItem, TodoItemSkeleton } from '../components/todoItem';
import { FlatList, RefreshControl, SafeAreaView, StyleSheet } from 'react-native';
import { Column, Row } from '../components/arrangements';
import { NoData } from '../components/noData';
import { BarAlert } from '../components/barAlert';
import { SimpleAlert } from '../components/simpleAlert';
import { getErrorMsg, isObjEmpty } from '../utils';
import { Chip, FAB, IconButton, TextInput } from 'react-native-paper';
import { AppDefTheme } from '../theme/colors';
import { Skeleton } from '../components/skeleton';
import { Modal } from '../components/modal';
import { Btn } from '../components/button';
import { useSelectTagsReducer } from '../reducers/tags';

export type TaskFormRoute = {
    id?: string,
}

type TaskItemModel = {
    completed?: boolean,
    onPressEdit?: () => unknown;
    onPressRemove?: () => unknown;
    onPressCompleted?: () => unknown;
} & TaskModel

type DeleteDialog = {
    show?: boolean,
    content?: string,
    title?: string,
    onPressYes?: () => unknown,
}

type TagModal = {
    show?: boolean,
    tag?: TagModel,
    onPressSave?: () => unknown,
    onPressRemove?: () => unknown,
}

type Loadings = {
    getTags?: boolean,
    getTasks?: boolean,
    updatingTask?: boolean,
    updatingTag?: boolean,
}


const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        zIndex: 99999,
    },
    completeHeight: {
        flex: 1,
    },
    col: {
        marginHorizontal: 20,
    },
    chip: {
        borderRadius: 999,
        borderColor: AppDefTheme.colors.primary,
    },
    rowGap: {
        gap: 10,
    },
    tagSkeleton: {
        marginVertical: 5,
        width: 70,
        height: 15,
    },
    flatList: {
        gap: 10,
    },
    chipText: {
        color: '#000',
    },
});

export function TagScreen(): React.JSX.Element {
    // All variables and states
    const nav = useNavigation();
    const isFocused = useIsFocused();

    // Loadings
    const [loadings, setLoadings] = useState({
        getTags: true,
        getTasks: true,
    } as Loadings);
    const [refreshing] = useState(false);

    // Dialogs and data to get/set
    const [tasks, setTasks] = useState([] as TaskItemModel[]);
    const [tags, setTags] = useState([] as TagModel[]);
    const [tagsSelected, setTagsSelected] = useSelectTagsReducer();
    const [deleteDialog, setDeleteDialog] = useState({} as DeleteDialog);

    // Error and success
    const [error, setErrorIfExist] = useErrorReducer();
    const [success, setSuccessIfExist] = useSuccessReducer();

    // Tag Modal
    const tagModalData = useRef({tag: {} as TagModel | undefined});
    const [tagModal, setTagModal] = useReducer(
        (prev: TagModal, data: TagModal) => {
            if (isObjEmpty(data)) return {};
            tagModalData.current.tag = { ...tagModalData.current.tag, ...data.tag };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {tag, ...allData} = data;
            return { ...prev, ...allData };
        },
        {} as TagModal
    );

    // All functions that needs states

    // For tags
    const getTags = async () => {
        setLoadings({ getTags: true });
        const res = await DoItApi.get(Api.categories);
        const tagsGettedData = res.data as TagModel[];

        if (res.error) {
            setErrorIfExist(res);
            return;
        }

        setTags(tagsGettedData);
        setLoadings({ getTags: false });
    };

    const saveTag = async () => {
        const tagData = tagModalData.current.tag;

        setLoadings({ updatingTag: true });

        const data: TagModel = { name: tagData?.name };
        const res = await DoItApi.put(Api.categories, data, tagData?._id);

        setLoadings({ updatingTag: false });

        if (res.error) {
            setErrorIfExist(res);
            return;
        }

        setSuccessIfExist(`The tag was ${ !tagData?._id ? 'created' : 'edited' } successfully`);
        setTagModal({});
        getTags();
    };

    const removeTag = async () => {
        const tagData = tagModalData.current.tag;

        setLoadings({ getTags: true });

        const res = await DoItApi.delete(Api.categories, tagData?._id);

        if (res.error){
            setErrorIfExist(res);
            return;
        }

        if (tagData?._id) setTagsSelected({tags: tagData, deselect: true});

        setSuccessIfExist('The tag was deleted successfully');
        setDeleteDialog({});
        setTagModal({});
        getTags();
    };

    // For tasks

    const refreshTasks = async () => {
        setLoadings({ getTasks: true });

        let res;

        const data = { categories: [] } as TaskModel;
        for (const tag of tagsSelected) data.categories?.push(tag._id!);

        if (tagsSelected.length) res = await DoItApi.get(Api.tasksSearch, data);
        else res = await DoItApi.get(Api.tasks);

        let todoItems: TaskItemModel[] = [];

        if (res.error!) {
            setErrorIfExist(res);
            return todoItems;
        }

        const resData = res.data as TaskModel[];

        for (const dataRes of resData) {
            const idParam: TaskFormRoute = { id: dataRes._id };
            const deleteDialogConfig: DeleteDialog = {
                show: true,
                title: 'Delete task',
                content: 'Are you sure to delete this task?',
                onPressYes: () => removeTask(dataRes._id!),
            };
            todoItems.push({
                ...dataRes,
                onPressRemove: () => setDeleteDialog(deleteDialogConfig),
                onPressCompleted: () => setCompletedTask(dataRes),
                onPressEdit: () => nav.navigate(...[AppRoutes.taskForm, idParam] as never), // Don't judge me 🙏
            });
        }

        setTasks(todoItems);
        setLoadings({ getTasks: false });
    };

    const removeTask = async (_id: string) => {
        const res = await DoItApi.delete(Api.tasks, _id);

        if (res.error){
            setErrorIfExist(res);
            return;
        }

        setSuccessIfExist('The task was deleted successfully');
        setDeleteDialog({ show: false });
        refreshTasks();
    };

    const setCompletedTask = async (data: TaskModel) => {
        const res = await DoItApi.patch(Api.tasks, data._id!, { completed: !data.completed });

        if (res.error){
            setErrorIfExist(res);
            return;
        }

        setSuccessIfExist(!(res.data as TaskModel).completed ? 'Task completed, ¡Congratulations!' : 'Task is now uncompleted');
        setLoadings({ updatingTask: false });
        refreshTasks();
    };

    // Use effects

    useEffect(() => {
        if (!tags.length) getTags();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    useEffect(() => {
        refreshTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused, tagsSelected]);

    // Renders for FlatList

    const todoItems = ({item, index}: {item: TaskItemModel, index: number}): React.JSX.Element => (
        <TodoItem
            key={index}
            title={item.title ?? ''}
            content={item.description ?? ''}
            completed={item.completed}
            onPressEdit={item.onPressEdit}
            onPressCompleted={item.onPressCompleted}
            onPressRemove={item.onPressRemove}
            onFlatList
        />
    );

    const tagItems = ({item, index}: {item: TagModel, index: number}) => {
        const isSelected = !!tagsSelected.find((tag: TagModel) => tag._id! === item._id!);

        const deleteDialogConfig: DeleteDialog = {
            show: true,
            title: 'Delete tag',
            content: 'Are you sure to delete this tag?',
            onPressYes: () => removeTag(),
        };

        const tagModalConfig: TagModal = {
            show: true,
            tag: item,
            onPressSave: item.by_user ? saveTag : () => {},
            onPressRemove: item.by_user ? () => {
                setDeleteDialog(deleteDialogConfig);
                setTagModal({show: false});
            } : () => {},
        };

        return (
            <Chip
                key={index}
                selectedColor={AppDefTheme.colors.primary}
                onLongPress={item.by_user ? () => setTagModal(tagModalConfig) : undefined}
                selected={isSelected}
                showSelectedCheck={false}
                compact
                textStyle={styles.chipText}
                style={styles.chip}
                mode="outlined"
                onClose={isSelected ? () => setTagsSelected({tags: item, deselect: isSelected}) : undefined}
                onPress={!isSelected ? () => setTagsSelected({tags: item}) : () => {}}
            >{item.name}</Chip>
        );
    };

    // Render
    return (
        <SafeAreaView style={styles.completeHeight}>
            <FAB
                style={styles.fab}
                theme={{ colors: { primary: AppDefTheme.colors.primary } }}
                onPress={() => setTagModal({ show: true, tag: { name: '' }, onPressSave: () => saveTag() })}
                mode="flat"
                icon="plus"
            />
            <Column style={[styles.col, styles.completeHeight]} gap={15}>
                <Row gap={0} noStretch>
                    {
                        loadings.getTags ? (
                            <Row style={styles.rowGap}>
                                <Chip style={styles.chip} compact mode="outlined" disabled><Skeleton style={styles.tagSkeleton} /></Chip>
                                <Chip style={styles.chip} compact mode="outlined" disabled><Skeleton style={styles.tagSkeleton} /></Chip>
                                <Chip style={styles.chip} compact mode="outlined" disabled><Skeleton style={styles.tagSkeleton} /></Chip>
                            </Row>
                        ) : (
                            <FlatList
                                horizontal
                                contentContainerStyle={styles.rowGap}
                                data={tags}
                                renderItem={tagItems}
                                keyExtractor={tag => tag._id!}
                            />
                        )
                    }
                </Row>
                <Column style={styles.completeHeight}>
                    {
                        loadings.getTasks ?
                        <>
                            <TodoItemSkeleton />
                            <TodoItemSkeleton />
                            <TodoItemSkeleton />
                        </> : (
                            tasks?.length ?
                            <FlatList
                                data={tasks}
                                refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={refreshTasks}/>
                                }
                                contentContainerStyle={styles.flatList}
                                renderItem={todoItems}
                                keyExtractor={task => task._id!}
                            /> :
                            <NoData
                                icon="clipboard-text-off-outline"
                                title={tagsSelected.length ? `No tasks available with this tag${tagsSelected.length === 1 ? 's' : ''}.` : 'No tasks found.'}
                            >
                                <Row gap={0} maxWidth="auto" noStretch>
                                    <Txt center>Add a new task </Txt>
                                    <Txt center bold onPress={()=>nav.navigate(AppRoutes.taskForm as never)}>here</Txt>
                                </Row>
                            </NoData>
                        )
                    }
                </Column>
            </Column>

            <Modal
                visible={tagModal.show ?? false}
                actions={tagModal.onPressRemove ? <IconButton icon="delete" iconColor="red" onPress={tagModal.onPressRemove} /> : undefined }
                title={tagModalData.current.tag?._id ? 'Edit Tag' : 'New tag'}
                onClose={() => setTagModal({ show: false })}>
                <Column>
                    {/* My component here generates a bug showing keyboard, it doesn't show it 😔 */}
                    <TextInput
                        value={ tagModalData.current.tag?.name }
                        onChangeText={txt => setTagModal({ tag: { name: txt }})}
                        mode="outlined"
                        label="Category name"
                    />
                    <Btn title="Save" loading={loadings.updatingTag} onPress={tagModal.onPressSave} />
                </Column>

                {
                    error?.error ? (
                        <BarAlert
                            text={error?.error ? getErrorMsg(error) : ''}
                            type="error"
                            visible={!!error?.error}
                            onDismiss={() => setErrorIfExist(undefined)}
                        />
                    ) : success ? (
                        <BarAlert
                            text={success}
                            type="success"
                            visible={!!success}
                            onDismiss={() => setSuccessIfExist(undefined)}
                        />
                    ) : null
                }
            </Modal>

            <BarAlert
                text={error?.error ? getErrorMsg(error) : ''}
                type="error"
                visible={!!error?.error}
                onDismiss={() => setErrorIfExist(undefined)}
            />

            <BarAlert
                text={success}
                type="success"
                duration={success ? undefined : 0}
                visible={!!success}
                onDismiss={() => setSuccessIfExist('')}
            />

            <SimpleAlert
                visible={deleteDialog.show ?? false}
                onDismiss={() => setDeleteDialog({ show: false })}
                type="danger"
                title={deleteDialog.title!}
                content={deleteDialog.content!}
                onPressYes={deleteDialog.onPressYes}
            />
        </SafeAreaView>
    );
}
