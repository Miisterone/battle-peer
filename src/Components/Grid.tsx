import { useState } from "react";

const GRID_SIZE = 10;

export function Grid() {
    const [selectedCells, setSelectedCells] = useState<number[]>([]);

    function handleCellClick(index: number) {
        if (!selectedCells.includes(index)) {
            setSelectedCells([...selectedCells, index]);
            console.log(index);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-700">
            <div className="grid grid-cols-10 gap-1 bg-blue-500 p-2 rounded-lg">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
                    <div key={index} className={`w-12 h-12 flex items-center justify-center border border-gray-300 cursor-pointer transition ${selectedCells.includes(index) ? "bg-red-500" : "bg-blue-300 hover:bg-blue-400"}`} onClick={() => handleCellClick(index)}>
                        {selectedCells.includes(index) ? "🔥" : ""}
                    </div>
                ))}
            </div>
        </div>
    );
}
