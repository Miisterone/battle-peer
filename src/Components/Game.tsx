import React, { useState } from 'react';
import Board from './Board';
import Connection from './Connection';
import { usePeerApi } from '../hooks/usePeerApi';
import styles from '../css/App.module.css';

type GamePhase = 'connection' | 'placement' | 'playing' | 'finished';

export interface GameState {
    phase: GamePhase;
    currentTurn: 'player' | 'opponent';
    message: string;
    hits: number;
}

function Game() {
    const [gameState, setGameState] = useState<GameState>({
        phase: 'connection',
        currentTurn: 'player',
        message: 'Connectez-vous pour commencer',
        hits: 0
    });

    const { sendMove } = usePeerApi();

    const handleConnect = () => {
        setGameState(prev => ({
            ...prev,
            phase: 'placement',
            message: 'Placez vos navires'
        }));
    };

    const handleShipsPlaced = async () => {
        setGameState(prev => ({
            ...prev,
            message: "En attente de l'autre joueur..."
        }));

        await sendMove({ type: 'ready' });

        // TODO: Attendre la réponse de l'autre joueur
        setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                phase: 'playing',
                message: 'La partie commence ! À vous de jouer'
            }));
        }, 2000);
    };

    const handlePlayerCellClick = (row: number, col: number) => {
        if (gameState.phase === 'playing') {
            console.log(`Votre plateau : (${row}, ${col})`);
        }
    };

    const handleEnemyCellClick = async (row: number, col: number, value: string) => {
        if (gameState.phase !== 'playing' || gameState.currentTurn !== 'player') return;

        await sendMove({ type: 'attack', position: { row, col } });

        const isHit = value !== '';
        setGameState(prev => ({
            ...prev,
            hits: prev.hits + (isHit ? 1 : 0),
            message: isHit ? 'Touché ! 💥' : 'Raté ! 💦',
            currentTurn: 'opponent'
        }));

        // Simuler le tour de l'adversaire
        setTimeout(() => {
            setGameState(prev => ({
                ...prev,
                currentTurn: 'player',
                message: 'À vous de jouer !'
            }));
        }, 1500);
    };

    return (
        <div className={styles.appContainer}>
            <h1 className={styles.title}>Bataille Navale P2P</h1>

            {gameState.phase === 'connection' ? (
                <Connection onConnect={handleConnect} />
            ) : (
                <>
                    <div className={styles.message}>
                        {gameState.message}
                    </div>
                    <div className={styles.boards}>
                        <Board
                            title="Votre Plateau"
                            isPlacement={gameState.phase === 'placement'}
                            onShipsPlaced={handleShipsPlaced}
                            onCellClick={handlePlayerCellClick}
                            isPlayerBoard={true}
                        />
                        <Board
                            title="Plateau Adversaire"
                            isPlacement={false}
                            onCellClick={handleEnemyCellClick}
                            disabled={gameState.currentTurn !== 'player' || gameState.phase !== 'playing'}
                            isPlayerBoard={false}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default Game;