import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Peer, { DataConnection } from 'peerjs';
import { PeerContext } from './contexts/PeerContext';
import { Connect } from './Pages/Connect';
import { Game } from './Pages/Game';

function App() {
    const [peer, setPeer] = useState<Peer | null>(null);
    const [connection, setConnection] = useState<DataConnection | null>(null);

    return (
        <PeerContext.Provider value={{ peer, setPeer, connection, setConnection }}>
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
