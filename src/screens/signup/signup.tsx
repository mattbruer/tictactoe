import {
    ScrollView,
    TextInput as NativeTextInput,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import React, { ReactElement, useRef, useState, useEffect } from "react";
import { GradientBackground, TextInput, Button, Text } from "@components";
import { Auth } from "aws-amplify";
import styles from "./signup.styles";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useHeaderHeight } from "@react-navigation/elements";
import { StackNavigatorParams } from "@config/navigator";
import { colors } from "@utils";
import { TouchableOpacity } from "react-native-gesture-handler";

type SignupProps = {
    navigation: NativeStackNavigationProp<StackNavigatorParams, "Signup">;
    route: RouteProp<StackNavigatorParams, "Signup">;
};

export default function Signup({
    navigation,
    route,
}: SignupProps): ReactElement {
    const unconfirmedUsername = route.params?.username;

    const [form, setForm] = useState({
        username: "test",
        email: "fischer15@jwvestates.com",
        name: "test testes",
        password: "12345678",
    });
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<"signup" | "otp">(
        unconfirmedUsername ? "otp" : "signup"
    );
    const [confirming, setConfirming] = useState(false);
    const [resending, setResending] = useState(false);

    const passwordRef = useRef<NativeTextInput | null>(null);
    const emailRef = useRef<NativeTextInput | null>(null);
    const nameRef = useRef<NativeTextInput | null>(null);

    const setFormInput = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const signup = async () => {
        setLoading(true);
        const { username, password, email, name } = form;
        try {
            const res = await Auth.signUp({
                username,
                password,
                attributes: { email, name },
            });
            setStep("otp");
        } catch (error) {
            Alert.alert("error!");
            console.log(error);
        }
        setLoading(false);
    };

    const confirmCode = async (code: string) => {
        setConfirming(true);
        try {
            await Auth.confirmSignUp(
                form.username || unconfirmedUsername || "",
                code
            );
            navigation.navigate("Login");
            Alert.alert("You can now log in with your account.");
        } catch (error) {
            console.log(error);
            Alert.alert("ERroR!");
        }
        setConfirming(false);
    };

    const resendCode = async (username: string) => {
        setResending(true);
        try {
            await Auth.resendSignUp(username);
        } catch (error: any) {
            console.log(error);
            Alert.alert(error);
        }
        setResending(false);
    };

    useEffect(() => {
        if (unconfirmedUsername) {
            resendCode(unconfirmedUsername);
        }
    }, []);
    return (
        <GradientBackground>
            <KeyboardAvoidingView
                keyboardVerticalOffset={useHeaderHeight()}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container}>
                    {step === "otp" && (
                        <>
                            <Text
                                style={{
                                    textAlign: "center",
                                    color: colors.lightGreen,
                                }}
                            >
                                Check email, and enter code here.
                            </Text>
                            {confirming ? (
                                <ActivityIndicator color={colors.lightGreen} />
                            ) : (
                                <>
                                    <OTPInputView
                                        placeholderCharacter="0"
                                        placeholderTextColor="#5d5379"
                                        pinCount={6}
                                        codeInputFieldStyle={styles.otpInputBox}
                                        codeInputHighlightStyle={
                                            styles.otpActiveInputBox
                                        }
                                        onCodeFilled={(code) => {
                                            confirmCode(code);
                                        }}
                                    />
                                    {resending ? (
                                        <ActivityIndicator
                                            color={colors.lightGreen}
                                        />
                                    ) : (
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (form.username) {
                                                    resendCode(form.username);
                                                }
                                                if (unconfirmedUsername) {
                                                    resendCode(
                                                        unconfirmedUsername
                                                    );
                                                }
                                            }}
                                        >
                                            <Text style={styles.resendLink}>
                                                Resend code
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    {step === "signup" && (
                        <>
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
                                returnKeyType="next"
                                secureTextEntry
                                placeholder="Password"
                                onSubmitEditing={() => {
                                    emailRef.current?.focus();
                                }}
                            />
                            <TextInput
                                keyboardType="email-address"
                                ref={emailRef}
                                value={form.email}
                                onChangeText={(value) => {
                                    setFormInput("email", value);
                                }}
                                returnKeyType="next"
                                placeholder="email"
                                style={{ marginBottom: 20 }}
                                onSubmitEditing={() => {
                                    nameRef.current?.focus();
                                }}
                            />
                            <TextInput
                                ref={nameRef}
                                value={form.name}
                                onChangeText={(value) => {
                                    setFormInput("name", value);
                                }}
                                returnKeyType="done"
                                placeholder="email"
                                style={{ marginBottom: 20 }}
                                onSubmitEditing={() => {}}
                            />
                            <Button
                                loading={loading}
                                title="Sign Up"
                                onPress={signup}
                            />
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </GradientBackground>
    );
}
