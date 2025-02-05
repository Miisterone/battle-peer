import React from 'react';
import Game from './components/Game';
import styles from './css/App.module.css';

function App() {
    return (
        <div className={styles.appContainer}>
            <Game />
        </div>
    );
}

export default App;