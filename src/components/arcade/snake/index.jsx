import React, { useState } from 'react';
import GameLoader from './GameLoader';
import SnakeGame from './SnakeGame';
import './WelcomeScreen.css';
import { logUserAction } from '@/utils/auditLogger';
import http from '@/tools/http';
import useStore from '@/store/index.jsx';

const ClosedBoxSVG = (
  <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="20" height="8" fill="#8B4513" stroke="black" strokeWidth="2"/>
    <path d="M2 10 q10 -5 20 0" fill="#A52A2A" stroke="black" strokeWidth="2"/>
    <rect x="11" y="12" width="2" height="2" fill="black" />
    <circle cx="12" cy="13" r="0.5" fill="silver" />
  </svg>
);

const OpenBoxSVG = (
  <svg width="50" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="10" width="20" height="8" fill="#8B4513" stroke="black" strokeWidth="2"/>
    <circle cx="6" cy="15" r="1" fill="gold" />
    <circle cx="8" cy="16" r="1" fill="gold" />
    <circle cx="10" cy="15" r="1" fill="gold" />
    <circle cx="12" cy="16" r="1" fill="gold" />
    <circle cx="14" cy="15" r="1" fill="gold" />
    <circle cx="16" cy="16" r="1" fill="gold" />
    <circle cx="18" cy="15" r="1" fill="gold" />
    <path d="M2 9 q10 -10 20 0" fill="#A52A2A" stroke="black" strokeWidth="2"/>
  </svg>
);

const GameContainer = () => {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [maxScore, setMaxScore] = useState(0);
  const [gamesStarted, setGamesStarted] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);

  const handleBoxClick = async () => {
    setIsBoxOpen(!isBoxOpen);
    setGameStartTime(Date.now());
    setGamesStarted(0);
    setTotalPlayTime(0);
    
    // Track the chest click
    try {
      const loginKey = localStorage.getItem('loginKey');
      if (loginKey) {
        const user = JSON.parse(loginKey);
        await http.post('/audit', {
          category: 'tracking',
          log: {
            action: 'treasure_chest_click',
            timestamp: new Date().toISOString(),
            userId: user.id,
            username: user.username
          }
        });
      }
    } catch (error) {
      console.error('Error tracking chest click:', error);
    }
    
    setTimeout(() => setShowLoader(true), 500);
  };

  const handleGameStart = async () => {
    try {
      const loginKey = localStorage.getItem('loginKey');
      if (loginKey) {
        const user = JSON.parse(loginKey);
        setGamesStarted(prev => prev + 1);
        await http.post('/audit', {
          category: 'tracking',
          log: {
            action: 'snake_game_start',
            timestamp: new Date().toISOString(),
            userId: user.id,
            username: user.username,
            gameStats: {
              gamesStarted: gamesStarted + 1
            }
          }
        });
      }
    } catch (error) {
      console.error('Error tracking game start:', error);
    }
  };

  const handleGameEnd = async (finalScore, gameStats) => {
    if (!gameStats || gameStats.processed) return;
    gameStats.processed = true;

    const playTime = Math.round((Date.now() - gameStartTime) / 1000);
    setMaxScore(Math.max(maxScore, finalScore));
    setTotalPlayTime(prev => prev + playTime);

    try {
      const loginKey = localStorage.getItem('loginKey');
      if (loginKey) {
        const user = JSON.parse(loginKey);
        await http.post('/audit', {
          category: 'tracking',
          log: {
            action: 'snake_game_end',
            timestamp: new Date().toISOString(),
            userId: user.id,
            username: user.username,
            gameStats: {
              score: finalScore,
              maxScore: Math.max(maxScore, finalScore),
              playTimeSeconds: playTime,
              totalPlayTimeSeconds: totalPlayTime + playTime,
              gamesStarted: gamesStarted,
              averageScore: ((maxScore * (gamesStarted - 1)) + finalScore) / gamesStarted,
              ...gameStats
            }
          }
        });
      }
    } catch (error) {
      console.error('Error tracking game end:', error);
    }
  };

  return (
    <div className="game-container">
      {!showLoader ? (
        <div className="start-screen">
          <h1>Ready for a Break?</h1>
          <p>What treasures lie within? There's only one way to find out.</p>
          <p>Click the mystery box!</p>
          <div onClick={handleBoxClick} className="treasure-box">
            {isBoxOpen ? OpenBoxSVG : ClosedBoxSVG}
          </div>
        </div>
      ) : !loadingComplete ? (
        <GameLoader 
          setLoadingComplete={setLoadingComplete} 
          onGameEnd={handleGameEnd}
          onGameStart={handleGameStart}
        />
      ) : (
        <SnakeGame 
          onGameEnd={handleGameEnd}
          onGameStart={handleGameStart}
        />
      )}
    </div>
  );
};

export { GameContainer as GameLoader, SnakeGame };
export default GameContainer;