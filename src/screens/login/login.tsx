import {
    ScrollView,
    TextInput as NativeTextInput,
    Alert,
    TouchableOpacity,
} from "react-native";
import React, { ReactElement, useRef, useState } from "react";
import { GradientBackground, TextInput, Button, Text } from "@components";
import { Auth } from "aws-amplify";
import styles from "./login.styles";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackNavigatorParams } from "@config/navigator";
import { RouteProp } from "@react-navigation/native";

type LoginProps = {
    navigation: NativeStackNavigationProp<StackNavigatorParams, "Login">;
    route: RouteProp<StackNavigatorParams, "Login">;
};

export default function Login({ navigation, route }: LoginProps): ReactElement {
    const redirect = route.params?.redirect;
    const [form, setForm] = useState({
        username: "test",
        password: "12345678",
    });
    const [loading, setLoading] = useState(false);

    const passwordRef = useRef<NativeTextInput | null>(null);

    const setFormInput = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const login = async () => {
        setLoading(true);
        const { username, password } = form;
        try {
            const res = await Auth.signIn(username, password);
            // navigation.navigate("Home");
            redirect
                ? navigation.replace(redirect)
                : navigation.navigate("Home");
        } catch (error) {
            if (error.code === "UserNotConfirmedException") {
                navigation.navigate("Signup", { username: form.username });
            } else {
                Alert.alert(
                    "error!",
                    error.message || "An error has occurred!"
                );
                console.log(error);
            }
        }
        setLoading(false);
    };
    return (
        <GradientBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    value={form.username}
                    onChangeText={(value) => {
                        setFormInput("username", value);
                    }}
                    returnKeyType="next"
                    placeholder="Username"
                    style={{ marginBottom: 20 }}
                    onSubmitEditing={() => {
                        passwordRef.current?.focus();
                    }}
                />
                <TextInput
                    ref={passwordRef}
                    value={form.password}
                    onChangeText={(value) => {
                        setFormInput("password", value);
                    }}
                    returnKeyType="done"
                    secureTextEntry
                    placeholder="Password"
                />
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("ForgotPassword");
                    }}
                >
                    <Text style={styles.forgotPasswordLink}>
                        Forgot Password?
                    </Text>
                </TouchableOpacity>
                <Button loading={loading} title="Login" onPress={login} />
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("Signup");
                    }}
                >
                    <Text style={styles.regText}>Don't have an account?</Text>
                </TouchableOpacity>
            </ScrollView>
        </GradientBackground>
    );
}
