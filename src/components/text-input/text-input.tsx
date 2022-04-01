import React, { ReactElement, forwardRef } from "react";
import {
    TextInput as TextInputNative,
    TextInputProps as NativeTextInputProps,
} from "react-native";

import { colors } from "@utils";

const TextInput = forwardRef<TextInputNative, NativeTextInputProps>(
    ({ style, ...props }: NativeTextInputProps, ref): ReactElement => {
        return (
            <TextInputNative
                ref={ref}
                {...props}
                placeholderTextColor={"#5d5379"}
                style={[
                    style,
                    {
                        height: 50,
                        width: "100%",
                        borderBottomWidth: 1,
                        borderColor: colors.lightGreen,
                        backgroundColor: colors.purple,
                        padding: 10,
                        color: colors.lightGreen,
                        fontFamily: "DeliusUnicase_400Regular",
                        marginBottom: 30,
                    },
                ]}
            />
        );
    }
);

TextInput.displayName = "TextInput";
export default TextInput;
