import { useState } from 'react';

interface UsePeerApi {
    isConnected: boolean;
    isJoining: boolean;
    peerId: string | null;
    error: string | null;
    joinRoom: (roomId: string) => Promise<void>;
    createRoom: () => Promise<string>;
    sendMove: (data: any) => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3001/api';

export function usePeerApi(): UsePeerApi {
    const [isConnected, setIsConnected] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [peerId, setPeerId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const createRoom = async (): Promise<string> => {
        try {
            const response = await fetch(`${API_BASE_URL}/rooms`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setPeerId(data.peerId);
            setIsConnected(true);
            return data.roomId;
        } catch (err) {
            setError("Erreur lors de la création de la salle");
            throw err;
        }
    };

    const joinRoom = async (roomId: string) => {
        setIsJoining(true);
        try {
            const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/join`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setPeerId(data.peerId);
            setIsConnected(true);
        } catch (err) {
            setError("Erreur lors de la connexion à la salle");
        } finally {
            setIsJoining(false);
        }
    };

    const sendMove = async (data: any) => {
        if (!peerId) return;

        try {
            await fetch(`${API_BASE_URL}/moves`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ peerId, ...data })
            });
        } catch (err) {
            setError("Erreur lors de l'envoi du coup");
        }
    };

    return {
        isConnected,
        isJoining,
        peerId,
        error,
        joinRoom,
        createRoom,
        sendMove
    };
}