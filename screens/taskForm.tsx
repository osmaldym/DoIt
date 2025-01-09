import React, { useEffect, useReducer, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, TextInput } from "react-native";
import { Txt } from "../components/text";
import { useNavigation } from "@react-navigation/native";
import { TaskModel } from "../api/models/task";
import { DoItApi } from "../api/DoIt";
import Api from "../enums/api.enum";
import { Column, Row } from "../components/arrangements";
import { useErrorReducer } from "../reducers/calls";
import { Btn } from "../components/button";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { AppDefTheme } from "../theme/colors";
import { TagModel } from "../api/models/tag";
import { Chip, Icon } from "react-native-paper";
import { Skeleton } from "../components/skeleton";
import { BarAlert } from "../components/barAlert";
import { getErrorMsg } from "../utils";

export type TaskFormRoute = {
    id?: string,
}

type Loadings = {
    getData?: boolean,
    sendData?: boolean
}

const styles = StyleSheet.create({
    columnStyle: {
        marginHorizontal: 15,
        paddingBottom: 15,
    },
    heightStretch: {
        flex: 1,
    },
    contentInput: {
        textAlignVertical: 'top',
        fontSize: 16,
    },
    titleInput: {
        fontSize: 28,
    },
    rowGap: {
        gap: 10
    },
    chip: {
        borderRadius: 999,
        borderColor: AppDefTheme.colors.primary,
    },
    tagSkeleton: {
        marginVertical: 5,
        width: 70,
        height: 15,
    },
    inputSkeleton: {
        marginVertical: 20,
    }
})


function getFormattedDate(dateStr?: string): string {
    const date = dateStr ? new Date(dateStr) : new Date();
    const locale = "en-EN"

    // 1 jan.
    const todayFormated = date.toLocaleDateString(locale, { month: 'short', day: 'numeric'  }) + '.';

    return todayFormated;
}

export function TaskForm({ route }: any): React.JSX.Element {
    
    // All variables and states
    const nav = useNavigation();
    
    const [loadings, setLoadings] = useState({
        getData: true,
        sendData: false,
    } as Loadings);
    
    const [isDatePickerVisible, showDatePicker] = useState(false);

    const [tagsGetted, setTagsGetted] = useState([] as TagModel[]);
    const [task, setTask] = useState({} as TaskModel);
    const [tag, setTag] = useState({} as TagModel);
    
    const [error, setErrorIfExist] = useErrorReducer();
    
    const params: TaskFormRoute = route.params!;
    const date = task?.date ? new Date(task?.date) : new Date();
    
    // All functions that needs states
    const handleConfirm = (date: Date) => {
        task.date = date.toISOString();
        showDatePicker(false);
    };

    const getTags = async () => {
        setLoadings({ getData: true });
        const res = await DoItApi.get(Api.categories);
        const tags = res.data as TagModel[];

        if (res.error) {
            setErrorIfExist(res);
            return;
        }
        
        setTagsGetted(tags);
        setLoadings({ getData: false });
    }

    const getTaskData = async (_id: string) => {
        setLoadings({ getData: true });
        const res = await DoItApi.get(Api.tasks, _id);
        
        if (res.error!) {
            setErrorIfExist(res.error);
            return;
        }

        setTask(res.data as TaskModel);
        setLoadings({ getData: false });
    }

    const saveTask = async () => {
        setLoadings({ sendData: true });

        if (tag._id) task.category = tag._id;

        const res = await DoItApi.put(Api.tasks, task, task._id);

        setLoadings({ sendData: false });
        
        if (res.error) {
            setErrorIfExist(res);
            return;
        }

        nav.goBack();
    }
    
    useEffect(() => {
        getTags()
        if (params?.id) getTaskData(params?.id)
        setTask({ date: date.toISOString() })
    }, [])

    useEffect(() => {
        if (task?.category){
            const tag = tagsGetted.find(tag => tag._id === task?.category);
            if (tag) setTag(tag);
        } else if (tagsGetted?.length) setTag(tagsGetted[0])
    }, [task, tagsGetted])

    const item = ({item, index}: {item: TagModel, index: number}) => {
        const isSelected = tag._id === item._id;

        return (
            <Chip
                key={index}
                selectedColor={AppDefTheme.colors.primary}
                selected={isSelected}
                showSelectedCheck={false}
                compact
                textStyle={{ color: '#000' }}
                style={styles.chip}
                mode="outlined"
                onClose={isSelected ? () => setTag({}) : undefined}
                onPress={() => setTag(item)}
            >{item.name}</Chip>
        )
    }

    // Renderization
    return (
        <SafeAreaView style={styles.heightStretch}>
            <Column style={{...styles.columnStyle, ...styles.heightStretch}}>
                <Txt bold size={32}>{ params?.id ? 'Edit task' : 'New task' }</Txt>
                <Row noStretch>    
                    <Btn
                        icon="calendar"
                        noBg
                        btnRight
                        size={18}
                        rippleColor={AppDefTheme.colors.primaryContainer}
                        onPress={() => showDatePicker(true)}
                        title={getFormattedDate(date.toISOString())}
                    />
                </Row>

                <Column>
                    {
                        loadings.getData ? (
                            <Row style={styles.rowGap}>
                                <Chip style={styles.chip} compact mode="outlined" disabled><Skeleton style={styles.tagSkeleton} /></Chip>
                                <Chip style={styles.chip} compact mode="outlined" disabled><Skeleton style={styles.tagSkeleton} /></Chip>
                                <Chip style={styles.chip} compact mode="outlined" disabled><Skeleton style={styles.tagSkeleton} /></Chip>
                            </Row>
                        ) : (
                            <FlatList
                                horizontal
                                contentContainerStyle={styles.rowGap}
                                data={tagsGetted}
                                renderItem={item}
                                keyExtractor={tag => tag._id!}
                            />
                        )
                    }
                </Column>

                <Column gap={0} style={styles.heightStretch}>
                    {
                        loadings.getData ? (
                            <>
                                <Skeleton style={styles.inputSkeleton}  height={28}/>
                                <Column>
                                    <Skeleton height={16}/>
                                    <Skeleton height={16}/>
                                    <Skeleton height={16}/>
                                </Column>
                            </>
                        ) : (
                            <>
                                <TextInput
                                    selectionColor={AppDefTheme.colors.primary}
                                    style={styles.titleInput}
                                    defaultValue={task.title}
                                    onChangeText={(e) => task.title = e}
                                    placeholder="Title"
                                />

                                <TextInput
                                    selectionColor={AppDefTheme.colors.primary}
                                    style={[styles.heightStretch, styles.contentInput]}
                                    numberOfLines={1}
                                    defaultValue={task.description}
                                    onChangeText={(e) => task.description = e}
                                    multiline
                                    maxLength={5000}
                                    placeholder="Content"
                                />
                            </>
                        )
                    }

                </Column>

                <Btn 
                    title="Save"
                    loading={!loadings.getData && loadings.sendData}
                    onPress={saveTask}
                />
                
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    date={date}
                    minimumDate={new Date()}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={() => showDatePicker(false)}
                />

                <BarAlert 
                    text={error?.error ? getErrorMsg(error) : ""}
                    type="error"
                    visible={!!error?.error}
                    onDismiss={() => setErrorIfExist(undefined)}
                />
            </Column>
        </SafeAreaView>
    )
}