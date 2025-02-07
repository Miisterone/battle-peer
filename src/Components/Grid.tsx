import { useState } from "react";

const GRID_SIZE = 10;
const BOATS = 5;

export function Grid() {
    const [boats, setBoats] = useState<number[][]>([]);
    const [placingBoat, setPlacingBoat] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [selectedCells, setSelectedCells] = useState<number[]>([]);

    function handleCellClick(index: number) {
        if (isPlaying) {
            if (!selectedCells.includes(index)) {
                setSelectedCells([...selectedCells, index]);
            }
        } else {
            if (placingBoat < BOATS) {
                setBoats([...boats, [index]]);
                setPlacingBoat(placingBoat + 1);
            }
        }
    }

    function startGame() {
        if (placingBoat === BOATS) {
            setIsPlaying(true);
        } else {
            alert("Place tous tes bateaux avant de commencer !");
        }
    }

    return (
        <div className="flex flex-col items-center mt-10 h-screen bg-gray-700">
            <h1 className="text-white font-bold mb-4">
                {isPlaying ? "Phase de jeu : Tire sur l'ennemi !" : "Place tes bateaux"}
            </h1>
            <div className="grid grid-cols-10 gap-1 bg-blue-500 p-2 rounded-lg">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                    const isBoat = boats.some(boat => boat.includes(index));
                    return (
                        <div
                            key={index}
                            className={`w-12 h-12 flex items-center justify-center border border-gray-300 cursor-pointer transition 
                ${selectedCells.includes(index) ? "bg-red-500" : isBoat ? "bg-gray-600" : "bg-blue-300 hover:bg-blue-400"}`}
                            onClick={() => handleCellClick(index)}
                        >
                            {selectedCells.includes(index) ? "🔥" : ""}
                        </div>
                    );
                })}
            </div>
            {!isPlaying && (
                <button onClick={startGame} className="mt-4 p-2 bg-green-500 text-white rounded">
                    Commencer la partie
                </button>
            )}
        </div>
    );
}
