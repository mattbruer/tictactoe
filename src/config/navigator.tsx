import React, { ReactElement } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
    createStackNavigator,
    StackNavigationOptions,
} from "@react-navigation/stack";
import {
    Home,
    SinglePlayerGame,
    Settings,
    Login,
    Signup,
    ChangePassword,
    ForgotPassword,
    MultiplayerHome,
    MultiplayerGame,
} from "@screens";
import { colors } from "@utils";

export type StackNavigatorParams = {
    Home: undefined;
    SinglePlayerGame: undefined;
    Settings: undefined;
    Login: { redirect: keyof StackNavigatorParams } | undefined;
    Signup: { username: string } | undefined;
    ChangePassword: undefined;
    ForgotPassword: undefined;
    MultiplayerHome: undefined;
    MultiplayerGame:
        | { gameID: string; invitee?: undefined }
        | { invitee: string; gameID?: undefined };
};

const Stack = createStackNavigator<StackNavigatorParams>();

const navigatorOptions: StackNavigationOptions = {
    headerTitleStyle: {
        fontFamily: "DeliusUnicase_700Bold",
        fontSize: 20,
    },
    headerBackTitleStyle: {
        fontFamily: "DeliusUnicase_400Regular",
        fontSize: 14,
    },
    headerStyle: {
        backgroundColor: colors.purple,
        shadowOffset: {
            height: 0,
            width: 0,
        },
    },
    headerTintColor: colors.lightGreen,
};

export default function Navigator(): ReactElement {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={navigatorOptions}>
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="Home"
                    component={Home}
                />
                <Stack.Screen
                    options={{ headerShown: false }}
                    name="SinglePlayerGame"
                    component={SinglePlayerGame}
                />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen
                    name="Signup"
                    component={Signup}
                    options={{ title: "Sign up" }}
                />
                <Stack.Screen
                    name="ChangePassword"
                    component={ChangePassword}
                    options={{ title: "Change Password" }}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{ title: "Forgot Password" }}
                />
                <Stack.Screen
                    name="MultiplayerHome"
                    component={MultiplayerHome}
                    options={{ title: "Multiplayer" }}
                />
                <Stack.Screen
                    name="MultiplayerGame"
                    component={MultiplayerGame}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
