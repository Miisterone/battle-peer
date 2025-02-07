import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";

export function Connect() {
    const navigate = useNavigate();
    const [myId, setMyId] = useState<string>("");
    const [idToPeer, setIdToPeer] = useState<string>("");

    useEffect(() => {
        getMyId();
    }, []);

    async function getMyId() {
        const url = "https://localhost:3000/api/connect";
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const body = await response.json();
            console.log("Mon ID Peer :", body.id);
            setMyId(body.id);
        } catch (error: unknown) {
            console.error("Error Fetch GetMyID "+ (error as Error).message);
        }
    }

    function connectToPeer(event: React.FormEvent) {
        event.preventDefault();

        if (!idToPeer) {
            alert("Veuillez entrer un ID Peer !");
            return;
        }
        const peer = new Peer(null, {
            host: window.location.hostname,
            port: 3000,
            path: '/peerjs/myapp'
        });

        console.log(`Tentative de connexion à ${idToPeer}`);
        const connection = peer.connect(idToPeer, { reliable: true });

        connection.on("open", () => {
            console.log(`Connecté à ${idToPeer}`);
            connection.send("Hello from peer!");
            
            navigate("rooms", { state: { idToPeer: idToPeer } });
        });

        connection.on("data", (data) => {
            console.log("Données reçues :", data);
        });

        connection.on("error", (err) => {
            console.error("Erreur de connexion PeerJS :", err);
        });
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-700">
            <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center text-2xl font-bold text-gray-900">
                    Battle Peer
                </h2>
                <p className="text-center text-gray-900">
                    My id: {myId}
                </p>
                <form onSubmit={connectToPeer} className="space-y-6">
                    <div>
                        <label htmlFor="idpeer" className="block text-sm font-medium text-gray-700">
                            Id To Peer
                        </label>
                        <input
                            id="idpeer"
                            name="idpeer"
                            type="text"
                            required
                            placeholder={"e5az8sqdqz5eae"}
                            className="mt-2 block w-full rounded-md border-gray-300 p-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(event) => setIdToPeer(event.target.value)}
                        />
                    </div>

                    <div>
                        <button type="submit"
                                className="w-full rounded-md bg-indigo-600 p-2 text-white font-semibold shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                            Connect
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}