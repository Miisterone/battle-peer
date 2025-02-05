import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import ShipSelector, { Ship } from './ShipSelector';
import styles from '../css/Board.module.css';

const INITIAL_SHIPS: Ship[] = [
    { id: 'carrier', name: 'Porte-avions', size: 5, available: true, icon: '🚀' },
    { id: 'battleship', name: 'Cuirassé', size: 4, available: true, icon: '🛥️' },
    { id: 'cruiser', name: 'Croiseur', size: 3, available: true, icon: '⛴️' },
    { id: 'submarine', name: 'Sous-marin', size: 3, available: true, icon: '🌊' },
    { id: 'destroyer', name: 'Destroyer', size: 2, available: true, icon: '🚤' },
];

interface BoardProps {
    title: string;
    isPlacement: boolean;
    onShipsPlaced?: () => void;
    onCellClick?: (row: number, col: number, value: string) => void;
    disabled?: boolean;
    isPlayerBoard: boolean;
}

const Board: React.FC<BoardProps> = ({
                                         title,
                                         isPlacement,
                                         onShipsPlaced,
                                         onCellClick,
                                         disabled = false,
                                         isPlayerBoard
                                     }) => {
    const gridSize = 10;
    const [grid, setGrid] = useState<string[][]>(
        Array.from({ length: gridSize }, () => Array(gridSize).fill(''))
    );
    const [ships, setShips] = useState<Ship[]>(INITIAL_SHIPS);
    const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
    const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
    const [lastPlaced, setLastPlaced] = useState<{row: number, col: number} | null>(null);
    const [attacks, setAttacks] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isPlacement && ships.every(ship => !ship.available)) {
            onShipsPlaced?.();
        }
    }, [ships, isPlacement, onShipsPlaced]);

    const canPlaceShip = (row: number, col: number, shipSize: number, orientation: 'horizontal' | 'vertical') => {
        if (orientation === 'horizontal') {
            if (col + shipSize > gridSize) return false;
            for (let j = col; j < col + shipSize; j++) {
                if (grid[row][j] !== '') return false;
            }
        } else {
            if (row + shipSize > gridSize) return false;
            for (let i = row; i < row + shipSize; i++) {
                if (grid[i][col] !== '') return false;
            }
        }
        return true;
    };

    const placeShip = (row: number, col: number, ship: Ship, orientation: 'horizontal' | 'vertical') => {
        const newGrid = grid.map(r => [...r]);
        if (orientation === 'horizontal') {
            for (let j = col; j < col + ship.size; j++) {
                newGrid[row][j] = ship.icon;
            }
        } else {
            for (let i = row; i < row + ship.size; i++) {
                newGrid[i][col] = ship.icon;
            }
        }
        setGrid(newGrid);
        setLastPlaced({row, col});

        setTimeout(() => setLastPlaced(null), 500);

        setShips(ships.map(s => s.id === ship.id ? { ...s, available: false } : s));
        setSelectedShip(null);
    };

    const handleCellClick = (row: number, col: number) => {
        if (disabled) return;

        const key = `${row}-${col}`;
        if (!isPlayerBoard && !attacks.has(key)) {
            setAttacks(prev => new Set([...prev, key]));
            onCellClick?.(row, col, grid[row][col]);
            const newGrid = grid.map(r => [...r]);
            newGrid[row][col] = grid[row][col] ? '💥' : '💦';
            setGrid(newGrid);
        } else if (isPlacement && selectedShip) {
            if (canPlaceShip(row, col, selectedShip.size, orientation)) {
                placeShip(row, col, selectedShip, orientation);
            }
        }
    };

    const toggleOrientation = () => {
        setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
    };

    return (
        <div className={styles.boardContainer}>
            <h2 className={styles.title}>{title}</h2>
            {isPlacement && (
                <>
                    <ShipSelector
                        ships={ships}
                        selectedShip={selectedShip}
                        onSelectShip={setSelectedShip}
                    />
                    <button
                        onClick={toggleOrientation}
                        className={`
              mb-4 px-4 py-2 bg-gray-200 rounded-full 
              hover:bg-gray-300 transition-all duration-300 
              transform hover:scale-110 active:scale-95 text-2xl
            `}
                    >
                        {orientation === 'horizontal' ? '↔️' : '↕️'}
                    </button>
                </>
            )}
            <div className={`${styles.grid} ${disabled ? styles.disabled : ''}`}>
                {grid.map((rowData, i) =>
                    rowData.map((cell, j) => (
                        <Cell
                            key={`${i}-${j}`}
                            row={i}
                            col={j}
                            value={cell}
                            onClick={handleCellClick}
                            isLastPlaced={lastPlaced?.row === i && lastPlaced?.col === j}
                            isAttacked={attacks.has(`${i}-${j}`)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Board;