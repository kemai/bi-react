import React, { useState, useEffect } from 'react';
import SnakeGame from './SnakeGame';
import './GameLoader.css';

const loadingMessages = [
    "Gathering fruits for the snake...",
    "Preparing the playfield...",
    "Sharpening the snake's scales...",
    "Positioning food on the ground...",
    "Optimizing movement physics...",
    "Loading ultra-realistic textures...",
    "Inserting secret superpowers...",
    "Checking Internet connection...",
    "Assigning bonus points...",
    "Setting records to beat...",
    "Preparing surprising sound effects...",
    "Mixing the soundtrack...",
    "Loading the high score...",
    "Checking for game updates...",
    "Customizing the gameplay experience...",
    "Launching a Rocket to the Moon.."
];

const GameLoader = ({ setLoadingComplete, onGameEnd, onGameStart }) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');

    useEffect(() => {
        if (!gameStarted) {
            let totalTime = 0;

            const changeMessage = () => {
                if (totalTime >= 3000) {
                    setLoadingMessage('Ready! Starting the game...');
                    setTimeout(() => {
                        setGameStarted(true);
                        setLoadingComplete(true);
                    }, 1000);
                    return;
                }

                const intervalTime = Math.floor(Math.random() * 500) + 200;
                totalTime += intervalTime;

                const randomMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
                setLoadingMessage(randomMessage);

                setTimeout(changeMessage, intervalTime);
            };

            changeMessage();
        }
    }, [gameStarted, setLoadingComplete]);

    return (
        <div className="game-loader">
            {!gameStarted ? (
                <div className="loading-screen">
                    <h1>Loading Game Interface</h1>
                    <p>processing data...</p>
                    <div className="loading-bar">
                        <div className="loading-progress"></div>
                    </div>
                    <p>{loadingMessage}</p>
                </div>
            ) : (
                <SnakeGame 
                    onGameEnd={onGameEnd}
                    onGameStart={onGameStart}
                />
            )}
        </div>
    );
};

export default GameLoader; 