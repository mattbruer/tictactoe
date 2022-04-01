import {
    View,
    TouchableOpacity,
    TouchableOpacityProps,
    ActivityIndicator,
} from "react-native";
import React, { ReactElement } from "react";
import Text from "../../components/text/text";
import styles from "./button.styles";

type ButtonProps = {
    title: string;
    loading?: boolean;
} & TouchableOpacityProps;

export default function Button({
    title,
    style,
    loading,
    ...props
}: ButtonProps): ReactElement {
    return (
        <View>
            <TouchableOpacity
                disabled={loading}
                {...props}
                style={[styles.button, style]}
            >
                {loading ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text weight="700" style={styles.buttonText}>
                        {title}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
