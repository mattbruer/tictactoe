import { StyleSheet } from "react-native";
import { colors } from "@utils";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    regText: {
        marginTop: 20,
        color: colors.lightGreen,
        textAlign: "center",
        textDecorationLine: "underline",
    },
    forgotPasswordLink: {
        color: colors.lightGreen,
        textAlign: "right",
    },
});

export default styles;
