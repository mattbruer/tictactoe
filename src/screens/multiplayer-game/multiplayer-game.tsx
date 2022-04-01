import React, { ReactElement, useEffect, useState } from "react";
import { Alert, View, ActivityIndicator } from "react-native";
import { API, graphqlOperation, loadingSceneName } from "aws-amplify";

import { GradientBackground, Text, Board } from "@components";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { StackNavigatorParams } from "@config/navigator";
import { getGame, startGame, playMove } from "./multiplayer-game.graphql";
import { GraphQLResult } from "@aws-amplify/api";
import { getGameQuery, playMoveMutation, startGameMutation } from "@api";
import styles from "./multiplayer-game.styles";
import { BoardState, colors } from "@utils";

type GameType = getGameQuery["getGame"];
type MultiplayerGameScreenNavigationProp = StackNavigationProp<
    StackNavigatorParams,
    "MultiplayerGame"
>;
type MultiplayerGameScreenRouteProp = RouteProp<
    StackNavigatorParams,
    "MultiplayerGame"
>;
type MultiPlayerGameProps = {
    navigation: MultiplayerGameScreenNavigationProp;
    route: MultiplayerGameScreenRouteProp;
};

export default function MultiplayerGame({
    navigation,
    route,
}: MultiPlayerGameProps): ReactElement {
    const { gameID: existingGameID, invitee } = route.params;
    const [gameID, setGameID] = useState<string | null>(null);
    const [game, setGame] = useState<GameType | null>(null);
    const [loading, setLoading] = useState(false);

    const initGame = async () => {
        setLoading(true);
        let gameID = existingGameID;
        try {
            if (!gameID) {
                const startGameRes = (await API.graphql(
                    graphqlOperation(startGame, {
                        invitee,
                    })
                )) as GraphQLResult<startGameMutation>;
                if (startGameRes.data?.startGame) {
                    gameID = startGameRes.data.startGame.id;
                }
            }
            if (gameID) {
                const getGameRes = (await API.graphql(
                    graphqlOperation(getGame, {
                        id: gameID,
                    })
                )) as GraphQLResult<getGameQuery>;
                if (getGameRes.data?.getGame) {
                    setGame(getGameRes.data?.getGame);
                    setGameID(gameID);
                }
            }
        } catch (error) {
            Alert.alert(
                "Error!",
                "An error has occurred. Please try again later!"
            );
        }
        setLoading(false);
    };

    const playerTurn = async (index: number) => {
        try {
            const playMoveRes = (await API.graphql(
                graphqlOperation(playMove, {
                    index,
                    game: gameID,
                })
            )) as GraphQLResult<playMoveMutation>;
            console.log(playMoveRes);
        } catch (error) {
            if (error.errors && error.errors.length > 0) {
                console.log(error);
                return;
            }
            Alert.alert("Error", error.message || "An error has occurred :(");
        }
    };
    useEffect(() => {
        initGame();
    }, []);

    return (
        <GradientBackground>
            {loading && (
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ActivityIndicator color={colors.lightGreen} />
                </View>
            )}
            {game && (
                <Board
                    size={300}
                    state={game.state as BoardState}
                    onCellPressed={(index) => {
                        playerTurn(index);
                    }}
                />
            )}
        </GradientBackground>
    );
}
