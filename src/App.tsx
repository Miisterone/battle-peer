import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Connect} from "./Pages/Connect.tsx";
import {Game} from "./Pages/Game.tsx";

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Connect/>}/>
                <Route path="/rooms" element={<Game/>}/>
            </Routes>
        </Router>
    )
}

export default App
