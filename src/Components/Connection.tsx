import React, { useState } from 'react';
import { usePeerApi } from '../hooks/usePeerApi';
import styles from '../css/App.module.css';

interface ConnectionProps {
    onConnect: () => void;
}

function Connection({ onConnect }: ConnectionProps) {
    const [roomId, setRoomId] = useState('');
    const { isJoining, error, joinRoom, createRoom } = usePeerApi();

    const handleCreateRoom = async () => {
        try {
            const newRoomId = await createRoom();
            setRoomId(newRoomId);
            onConnect();
        } catch (err) {
            console.error(err);
        }
    };

    const handleJoinRoom = async () => {
        if (!roomId) return;
        await joinRoom(roomId);
        onConnect();
    };

    return (
        <div className={styles.loginContainer}>
            <div className="flex flex-col gap-4 w-full">
                <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Code de la partie"
                    className={styles.loginInput}
                />

                <button
                    onClick={handleJoinRoom}
                    disabled={isJoining || !roomId}
                    className={styles.loginButton}
                >
                    {isJoining ? 'Connexion...' : 'Rejoindre une partie'}
                </button>

                <div className="text-center text-gray-500">ou</div>

                <button
                    onClick={handleCreateRoom}
                    className={styles.connectPeerButton}
                >
                    Créer une nouvelle partie
                </button>

                {error && (
                    <div className="text-red-500 text-center">{error}</div>
                )}

                {roomId && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg text-center">
                        Code de la partie: <strong>{roomId}</strong>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Connection;