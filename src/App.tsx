import { useState } from "react";
import { PeerContext } from "./contexts/PeerContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Connect } from "./Pages/Connect";
import { Game } from "./Pages/Game";
import {DataConnection} from "peerjs";

function App() {
    const [connection, setConnection] = useState<DataConnection | null>(null);

    return (
        <PeerContext.Provider value={{ connection, setConnection }}>
            <Router>
                <Routes>
                    <Route path="/" element={<Connect />} />
                    <Route path="/rooms" element={<Game />} />
                </Routes>
            </Router>
        </PeerContext.Provider>
    );
}

export default App;
