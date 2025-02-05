import React from 'react';

interface Ship {
    id: string;
    name: string;
    size: number;
    available: boolean;
    icon: string;
}

interface ShipSelectorProps {
    ships: Ship[];
    selectedShip: Ship | null;
    onSelectShip: (ship: Ship) => void;
}

const ShipSelector: React.FC<ShipSelectorProps> = ({
                                                       ships = [],
                                                       selectedShip,
                                                       onSelectShip
                                                   }) => {
    if (!ships?.length) return null;

    return (
        <div className="flex flex-wrap gap-2 justify-center mb-4 p-2">
            {ships.map((ship) => (
                <button
                    key={ship.id}
                    onClick={() => ship.available && onSelectShip(ship)}
                    className={`
            flex items-center px-3 py-2 rounded-lg transform transition-all duration-300
            hover:scale-105 active:scale-95
            ${!ship.available
                        ? 'bg-gray-300 cursor-not-allowed opacity-50'
                        : selectedShip?.id === ship.id
                            ? 'bg-blue-500 text-white shadow-lg'
                            : 'bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50'
                    }
          `}
                    disabled={!ship.available}
                    title={`${ship.name} (Taille: ${ship.size})`}
                >
                    <span className="mr-2">{ship.name}</span>
                    <div className="flex animate-pulse">
                        {[...Array(ship.size)].map((_, i) => (
                            <span key={i} className="text-2xl transition-transform hover:rotate-12">
                {ship.icon}
              </span>
                        ))}
                    </div>
                </button>
            ))}
        </div>
    );
};

export { type Ship };
export default ShipSelector;