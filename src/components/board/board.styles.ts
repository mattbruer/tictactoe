import { StyleSheet } from "react-native";
import { colors } from "@utils";

const styles = StyleSheet.create({
    board: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    cell: {
        width: "33.3333%",
        height: "33.3333%",
        backgroundColor: colors.darkPurple,

        borderWidth: 2,
        borderColor: colors.lightGreen,
        justifyContent: "center",
        alignItems: "center",
    },
    cellText: {
        color: colors.lightGreen,
    },
});

export default styles;
