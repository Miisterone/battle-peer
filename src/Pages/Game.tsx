import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePeer } from "../contexts/PeerContext";
import { Grid } from "../Components/Grid";

export function Game() {
    const location = useLocation();
    const idToPeer = location.state?.idToPeer || "";
    const { connection } = usePeer();

    const [myReady, setMyReady] = useState(false);
    const [opponentReady, setOpponentReady] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [isMyTurn, setIsMyTurn] = useState(false);

    useEffect(() => {
        if (connection) {
            connection.on("data", (data: any) => {
                console.log("Données reçues :", data);
                if (data && typeof data === "object") {
                    if (data.type === "ready") {
                        console.log("L'adversaire est prêt");
                        setOpponentReady(true);
                    }
                }
            });
        }
    }, [connection]);


    useEffect(() => {
        if (myReady && opponentReady) {
            setGameStarted(true);
            setIsMyTurn(Math.random() < 0.5);
            console.log("Les deux joueurs sont prêts, la partie démarre !");
        }
    }, [myReady, opponentReady]);

    function handleReady(boats: number[][]) {
        console.log("Ma flotte :", boats);
        setMyReady(true);
        if (connection) {
            console.log("sending ready message");
            if (connection.open) {
                console.log("connection is open");
                connection.send({ type: "ready", boats });
                console.log("message sent");
            } else {
                console.log("connection is not open");
                connection.on("open", () => {
                    connection.send({ type: "ready", boats });
                });
            }
            console.log("message sent before all");
        }
    }

    function handleMove(cell: number) {
        console.log("Joue le coup sur la case :", cell);
        if (connection) {
            connection.send({ type: "move", cell });
        }
        setIsMyTurn(false);
    }

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-700">
            <h1 className="text-white text-3xl font-bold mb-4 mt-20">Battle Peer</h1>
            <h3 className="text-white font-bold">Connecté à {idToPeer}</h3>
            {!gameStarted ? (
                <>
                    <p className="text-white mb-2">
                        {myReady
                            ? "En attente que l'adversaire soit prêt..."
                            : "Place ta flotte et valide quand tu es prêt"}
                    </p>
                    <Grid onReady={handleReady} gamePhase="placement" />
                </>
            ) : (
                <>
                    <div className="text-white text-xl mb-4">
                        {isMyTurn ? "C'est ton tour !" : "Attends ton tour..."}
                    </div>
                    <Grid onMove={handleMove} gamePhase="battle" />
                </>
            )}
        </div>
    );
}
