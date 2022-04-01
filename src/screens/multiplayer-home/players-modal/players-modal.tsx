import React, { ReactElement, useEffect, useState, useRef } from "react";
import {
    View,
    Dimensions,
    Alert,
    TextInput as NativeTextInput,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { API, graphqlOperation } from "aws-amplify";

import { GraphQLResult } from "@aws-amplify/api";
import { searchPlayersQuery } from "@api";
import { GradientBackground, Text, TextInput } from "@components";
import { searchPlayers } from "../multiplayer-home.graphql";
import { colors } from "@utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import styles from "./players-modal.styles";

type PlayesListType = Exclude<
    searchPlayersQuery["searchPlayers"],
    null | undefined
>["items"];

type PlayersModalProps = {
    onItemPress: (username: string) => void;
};

export default function PlayersModal({
    onItemPress,
}: PlayersModalProps): ReactElement {
    const [players, setPlayers] = useState<PlayesListType | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [sumbmittedQuery, setSubmittedQuery] = useState("");

    const inputRef = useRef<NativeTextInput | null>(null);

    const fetchPlayers = async (searchString: string) => {
        setLoading(true);
        setSubmittedQuery(searchString);
        try {
            const players = (await API.graphql(
                graphqlOperation(searchPlayers, {
                    limit: 10,
                    searchString: searchString,
                })
            )) as GraphQLResult<searchPlayersQuery>;
            if (players.data?.searchPlayers) {
                console.log(players.data.searchPlayers.items);
                setPlayers(players.data.searchPlayers.items);
            }
        } catch (error) {
            Alert.alert(
                "Error!",
                "An error has occurred. Please try again later!"
            );
        }
        setLoading(false);
    };

    useEffect(() => {
        setTimeout(() => {
            inputRef.current?.focus();
        }, 150);
    }, []);

    return (
        <View style={styles.modalContainer}>
            <GradientBackground>
                <View style={styles.searchContainer}>
                    <TextInput
                        value={searchQuery}
                        onChangeText={(text) => {
                            setSearchQuery(text);
                        }}
                        onSubmitEditing={() => {
                            fetchPlayers(searchQuery);
                        }}
                        ref={inputRef}
                        style={{
                            borderBottomWidth: 0,
                            backgroundColor: colors.darkPurple,
                        }}
                        placeholder="Type to search by username or name."
                        returnKeyType="search"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    {loading ? (
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ActivityIndicator color={colors.lightGreen} />
                        </View>
                    ) : (
                        <FlatList
                            contentContainerStyle={{ padding: 20 }}
                            data={players}
                            keyExtractor={(player) =>
                                player?.username || `${new Date().getTime()}`
                            }
                            ListEmptyComponent={() => {
                                return (
                                    <View>
                                        <Text
                                            style={{ color: colors.lightGreen }}
                                        >
                                            {sumbmittedQuery
                                                ? "No results found!"
                                                : "Type to search by name"}
                                        </Text>
                                    </View>
                                );
                            }}
                            renderItem={({ item }) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (item) {
                                                onItemPress(item?.username);
                                            }
                                        }}
                                        style={styles.playerItem}
                                    >
                                        <Text
                                            style={{ color: colors.lightGreen }}
                                        >
                                            {item?.name}
                                        </Text>
                                        <Text
                                            style={{ color: colors.lightGreen }}
                                        >
                                            {item?.username}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}
                </View>
            </GradientBackground>
        </View>
    );
}
