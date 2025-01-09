import { TextInput } from "react-native-paper";
import { PropsWithChildren, ReactNode, useState } from "react";
import { InputModeOptions, TextStyle, ViewStyle } from "react-native";
import { AppTxtStyle } from "../theme/texts";

const inputStyle: ViewStyle = {
    backgroundColor: 'transparent',
}

const txtInputStyle: TextStyle = {
    color: '#000',
    borderColor: 'none'
}

type InputProps = PropsWithChildren<{
    label?: string,
    value?: string,
    inputMode?: InputModeOptions,
    style?: ViewStyle,
    inputStyle?: TextStyle,
    inputContStyle?: ViewStyle,
    onTxtChange?: (text: string) => void,
    type?: "email" | "password"
}>;

export function Input(props: InputProps): React.JSX.Element {
    const [showPass, setShowPass] = useState(true);

    const eyeButton: ReactNode = <TextInput.Icon onPress={() => setShowPass(!showPass)} icon={showPass ? 'eye' : 'eye-off'} />;

    return (
        <TextInput
            value={props.value}
            label={props.label ?? "Email"}
            contentStyle={[AppTxtStyle, txtInputStyle, props.inputStyle]}
            right={props.type! === 'password' ? eyeButton : undefined}
            style={[inputStyle, props.style]}
            onChangeText={props.onTxtChange}
            inputMode={props.type! === 'email' ? props.type : 'none'}
            secureTextEntry={props.type! === 'password' && showPass}
            mode="outlined"
        />
    );
}