import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { usePeer } from "../contexts/PeerContext";

export function Connect() {
    const navigate = useNavigate();
    const [myId, setMyId] = useState<string>("");
    const [idToPeer, setIdToPeer] = useState<string>("");

    const { peer, setPeer, setConnection } = usePeer();

    useEffect(() => {
        if (!peer) {
            const newPeer = new Peer({
                host: window.location.hostname,
                port: 3000,
                path: '/peerjs'
            });

            newPeer.on("open", (id) => {
                console.log("My peer ID:", id);
                setMyId(id);
            });

            newPeer.on("connection", (conn) => {
                console.log("Connexion entrante de :", conn.peer);
                conn.once("open", () => {
                    console.log(`Connexion établie avec ${conn.peer}`);
                    conn.send("Hello from peer!");
                    setConnection(conn);
                    navigate("rooms", { state: { idToPeer: conn.peer } });
                });
                conn.on("data", (data) => {
                    console.log("Données reçues sur la connexion entrante :", data);
                });
            });

            setPeer(newPeer);
        }

        return () => {
            // if (peer) {
            //     peer.destroy()
            // }
        };
    }, [peer, navigate, setPeer, setConnection]);

    async function connectToPeer(event: React.FormEvent) {
        event.preventDefault();
        if (!idToPeer) {
            alert("Veuillez entrer un ID Peer !");
            return;
        }

        if (!peer) {
            console.error("Peer n’est pas encore initialisé.");
            return;
        }

        console.log(`Tentative de connexion à ${idToPeer}`);
        const conn = peer.connect(idToPeer, { reliable: true });

        conn.on("open", () => {
            console.log(`Connecté à ${idToPeer}`);
            conn.send("Hello from peer!");
            setConnection(conn);
            navigate("rooms", { state: { idToPeer } });
        });

        conn.on("error", (err) => {
            console.error("Erreur de connexion PeerJS :", err);
        });
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-700">
            <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold text-gray-900">
                    Battle Peer
                </h2>
                <p className="text-center text-gray-900">Mon ID : {myId}</p>
                <form onSubmit={connectToPeer} className="space-y-6">
                    <div>
                        <label htmlFor="idpeer" className="block text-sm font-medium text-gray-700">
                            ID du joueur adverse
                        </label>
                        <input
                            id="idpeer"
                            name="idpeer"
                            type="text"
                            required
                            placeholder="Entrez l'ID d'un autre joueur"
                            className="mt-2 block w-full rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(event) => setIdToPeer(event.target.value)}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full rounded-md bg-indigo-600 p-2 text-white font-semibold shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                        >
                            Connecter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
