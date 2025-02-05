import React from 'react';
import styles from '../css/Cell.module.css';

export interface CellProps {
    row: number;
    col: number;
    onClick: (row: number, col: number) => void;
    value?: string;
    isLastPlaced?: boolean;
    isAttacked?: boolean
}

const Cell: React.FC<CellProps> = ({row, col, onClick, value = '', isLastPlaced = false}) => {
    return (
        <div
            className={`
                ${styles.cell}
                ${isLastPlaced ? styles.lastPlaced : ''}
                transition-all duration-300
                hover:scale-105 active:scale-95
                ${value ? 'text-2xl' : ''}
            `}
            onClick={() => onClick(row, col)}>
            {value}
        </div>
    );
};

export default Cell;