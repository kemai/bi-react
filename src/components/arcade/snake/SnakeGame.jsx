import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const SnakeGame = ({ onGameEnd, onGameStart }) => {
    const [snake, setSnake] = useState([{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }]);
    const [food, setFood] = useState({ x: 300, y: 200 });
    const [direction, setDirection] = useState({ dx: 20, dy: 0 });
    const [score, setScore] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false);
    const [gameStartTime, setGameStartTime] = useState(null);
    const [highestScore, setHighestScore] = useState(0);
    const [movesCount, setMovesCount] = useState(0);
    const [foodEaten, setFoodEaten] = useState(0);
    const [playTime, setPlayTime] = useState(0);
    const moveIntervalRef = useRef();
    const playTimeIntervalRef = useRef();
    const gameAreaSize = 400;
    const cellSize = 20;

    const startGame = () => {
        setIsGameActive(true);
        setScore(0);
        setFoodEaten(0);
        setPlayTime(0);
        setGameStartTime(Date.now());
        setSnake([{ x: 160, y: 200 }, { x: 140, y: 200 }, { x: 120, y: 200 }]);
        setDirection({ dx: 20, dy: 0 });
        
        // Start tracking play time
        playTimeIntervalRef.current = setInterval(() => {
            setPlayTime(prev => prev + 1);
        }, 1000);

        // Track game start
        onGameStart?.();
    };

    const endGame = () => {
        if (!isGameActive) return; // Prevent multiple calls
        
        setIsGameActive(false);
        clearInterval(moveIntervalRef.current);
        clearInterval(playTimeIntervalRef.current);
        
        // Update top score if necessary
        const newTopScore = Math.max(score, highestScore);
        setHighestScore(newTopScore);
        
        // Make sure onGameEnd exists and score > 0
        if (typeof onGameEnd === 'function' && score > 0) {
            const gameStats = {
                finalScore: score,
                topScore: newTopScore,
                playTimeSeconds: playTime,
                duration: Math.round((Date.now() - gameStartTime) / 1000),
                moves: movesCount,
                foodEaten,
                highestScore: newTopScore,
                averageMovesPerFood: foodEaten > 0 ? movesCount / foodEaten : 0,
                gameStartTime: gameStartTime,
                gameEndTime: Date.now()
            };
            onGameEnd(score, gameStats);
        }
    };

    const updateSnakePosition = () => {
        if (!isGameActive) return;

        setMovesCount(prev => prev + 1);
        let newSnake = [...snake];
        let head = { x: newSnake[0].x + direction.dx, y: newSnake[0].y + direction.dy };
    
        head.x = (head.x + gameAreaSize) % gameAreaSize;
        head.y = (head.y + gameAreaSize) % gameAreaSize;
    
        newSnake.unshift(head);
    
        if (head.x === food.x && head.y === food.y) {
            setFood(createFood());
            setScore(prev => prev + 1);
            setFoodEaten(prev => prev + 1);
            setHighestScore(prev => Math.max(prev, score + 1));
        } else {
            newSnake.pop();
        }
    
        if (checkSnakeCollision(newSnake)) {
            endGame();
            return;
        }
    
        setSnake(newSnake);
    };
    
    const checkSnakeCollision = (newSnake) => {
        for (let i = 4; i < newSnake.length; i++) {
            if (newSnake[i].x === newSnake[0].x && newSnake[i].y === newSnake[0].y) {
                return true;
            }
        }
        return false;
    };

    const createFood = () => {
        let newFoodPosition;
        do {
            newFoodPosition = {
                x: Math.floor(Math.random() * (gameAreaSize / cellSize)) * cellSize,
                y: Math.floor(Math.random() * (gameAreaSize / cellSize)) * cellSize
            };
        } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    
        return newFoodPosition;
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isGameActive && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
                e.preventDefault();
              }
              
            if (!isGameActive) return;
            
            switch (e.key) {
                case "ArrowUp":
                    if (direction.dy === 0) setDirection({ dx: 0, dy: -cellSize });
                    break;
                case "ArrowDown":
                    if (direction.dy === 0) setDirection({ dx: 0, dy: cellSize });
                    break;
                case "ArrowLeft":
                    if (direction.dx === 0) setDirection({ dx: -cellSize, dy: 0 });
                    break;
                case "ArrowRight":
                    if (direction.dx === 0) setDirection({ dx: cellSize, dy: 0 });
                    break;
                default:
                    break;
            }
        };
    
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [direction, isGameActive]);

    useEffect(() => {
        if (isGameActive) {
            moveIntervalRef.current = setInterval(updateSnakePosition, 100);
        }
        return () => clearInterval(moveIntervalRef.current);
    }, [snake, direction, isGameActive]);

    useEffect(() => {
        return () => {
            clearInterval(moveIntervalRef.current);
            clearInterval(playTimeIntervalRef.current);
        };
    }, []);

    return (
        <div className="snake-game-container">
            <div className="game-info">
                <div className="score-container">
                     <span className="font-semibold">Score: {score}</span>
                     <span className="font-semibold"style={{ marginLeft: 16 }}>Top Score: {highestScore}</span>
                     <span className="font-semibold" style={{ marginLeft: 16 }}>
                        Time: {Math.floor(playTime / 60)}:{String(playTime % 60).padStart(2, '0')}
                    </span>
                </div>
                {!isGameActive && (
                    <button className="start-button" onClick={startGame}>
                        {score > 0 ? 'Play Again' : 'Start Game'}
                    </button>
                )}
            </div>
            <div className="game-area">
                {snake.map((segment, index) => (
                    <div 
                        key={index} 
                        className="snake-segment" 
                        style={{ left: segment.x, top: segment.y }}
                    />
                ))}
                <div 
                    className="food" 
                    style={{ left: food.x, top: food.y }}
                />
            </div>
            <div className="game-instructions">
                <p className="mt-2 text-sm text-gray-500"> Use arrow keys to control the snake</p>
            </div>
        </div>
    );
};

export default SnakeGame; 