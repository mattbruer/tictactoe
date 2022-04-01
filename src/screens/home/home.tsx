import { View, ScrollView, Image, Alert } from "react-native";

import React, { ReactElement, useState } from "react";
import styles from "./home.styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorParams } from "@config/navigator";
import { GradientBackground, Button, Text } from "@components";
import { useAuth } from "@contexts/auth-context";
import { Auth } from "aws-amplify";

type HomeProps = {
    navigation: NativeStackNavigationProp<StackNavigatorParams, "Home">;
};

export default function Home({ navigation }: HomeProps): ReactElement {
    const { user } = useAuth();
    const [signingOut, setSigningOut] = useState(false);
    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <Image
                    style={styles.logo}
                    source={require("@assets/logo.png")}
                />
                <View style={styles.buttons}>
                    <Button
                        onPress={() => {
                            navigation.navigate("SinglePlayerGame");
                        }}
                        style={styles.button}
                        title="Single Player"
                    />
                    <Button
                        onPress={() => {
                            if (user) {
                                navigation.navigate("MultiplayerHome");
                            } else {
                                navigation.navigate("Login", {
                                    redirect: "MultiplayerHome",
                                });
                            }
                        }}
                        style={styles.button}
                        title="Multiplayer"
                    />
                    <Button
                        loading={signingOut}
                        onPress={async () => {
                            if (user) {
                                try {
                                    setSigningOut(true);
                                    await Auth.signOut();
                                } catch (error) {
                                    Alert.alert(error as string);
                                }
                                setSigningOut(false);
                            } else {
                                navigation.navigate("Login", {
                                    redirect: "Home",
                                });
                            }
                        }}
                        style={styles.button}
                        title={user ? "logout" : "login"}
                    />
                    <Button
                        onPress={() => {
                            navigation.navigate("Settings");
                        }}
                        style={styles.button}
                        title="Settings"
                    />
                    {user && (
                        <Text style={styles.loggedInText}>
                            Logged in as {user.username}
                        </Text>
                    )}
                </View>
            </ScrollView>
        </GradientBackground>
    );
}
