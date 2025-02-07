import { useLocation } from "react-router-dom";
import { Grid } from "../Components/Grid";

export function Game() {
    const location = useLocation();
    const idToPeer = location.state?.idToPeer || "";

    return (
        <div className="flex flex-col h-screen items-center justify-center bg-gray-700">
            <h1 className="text-white text-3xl font-bold mb-4 mt-20">Battle Peer</h1>
            <h3 className="text-white font-bold">Connecté à {idToPeer}</h3>
            <Grid />
        </div>
    );
}
