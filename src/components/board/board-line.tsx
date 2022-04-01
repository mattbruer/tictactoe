import { View, StyleSheet, Animated } from "react-native";
import React, { ReactElement, useEffect, useRef } from "react";
import { BoardResult, colors } from "@utils";

type BoardLineProps = {
    size: number;
    gameResult?: BoardResult | false;
};

export default function BoardLine({
    size,
    gameResult,
}: BoardLineProps): ReactElement {
    const diagonalHeight = Math.sqrt(Math.pow(size, 2) + Math.pow(size, 2));
    const animationRef = useRef<Animated.Value>(new Animated.Value(0));

    useEffect(() => {
        Animated.timing(animationRef.current, {
            toValue: 1,
            duration: 700,
            useNativeDriver: false,
        }).start();
    }, []);
    return (
        <>
            {gameResult && gameResult.column && gameResult.direction === "V" && (
                <Animated.View
                    style={[
                        styles.line,
                        styles.vLine,
                        {
                            height: animationRef.current.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0%", "100%"],
                            }),
                            left: `${33.333 * gameResult.column - 16.666}%`,
                        },
                    ]}
                ></Animated.View>
            )}
            {gameResult && gameResult.row && gameResult.direction === "H" && (
                <Animated.View
                    style={[
                        styles.line,
                        styles.hLine,
                        {
                            width: animationRef.current.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0%", "100%"],
                            }),
                            top: `${33.333 * gameResult.row - 16.666}%`,
                        },
                    ]}
                ></Animated.View>
            )}
            {gameResult && gameResult.diagonal && gameResult.direction === "D" && (
                <Animated.View
                    style={[
                        styles.line,
                        styles.dLine,
                        {
                            height: animationRef.current.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, diagonalHeight],
                            }),
                            transform: [
                                {
                                    translateY:
                                        animationRef.current.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [
                                                size / 2,
                                                -(diagonalHeight - size) / 2,
                                            ],
                                        }),
                                },
                                {
                                    rotateZ:
                                        gameResult.diagonal === "MAIN"
                                            ? "-45deg"
                                            : "45deg",
                                },
                            ],
                        },
                    ]}
                ></Animated.View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    line: {
        position: "absolute",
        backgroundColor: colors.lightPurple,
    },
    vLine: {
        width: 4,
    },
    hLine: {
        height: 4,
    },
    dLine: {
        width: 4,
        // height: "100%",
        top: 0,
        left: "50%",
    },
});
