import { View, Text } from "react-native";
import React, { Children, ReactElement } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ReactNode } from "react";

type GradientBackgroundProps = {
    children: ReactNode;
};

export default function GradientBackground({
    children,
}: GradientBackgroundProps): ReactElement {
    return (
        <View style={{ flex: 1 }}>
            <StatusBar style="light" />
            <LinearGradient
                // Background Linear Gradient
                colors={["#120318", "#221a36"]}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            />
            {children}
        </View>
    );
}
