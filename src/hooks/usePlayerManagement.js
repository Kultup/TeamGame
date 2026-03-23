import { useState, useCallback, useEffect } from 'react';

export function usePlayerManagement() {
  const [playerCount, setPlayerCount] = useState(() => {
    const saved = localStorage.getItem('team_game_playerCount');
    return saved !== null ? parseInt(saved, 10) : null;
  });
  const [playerNames, setPlayerNames] = useState(() => {
    const saved = localStorage.getItem('team_game_playerNames');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(() => {
    const saved = localStorage.getItem('team_game_currentPlayerIdx');
    return saved !== null ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    if (playerCount !== null) localStorage.setItem('team_game_playerCount', playerCount);
    localStorage.setItem('team_game_playerNames', JSON.stringify(playerNames));
    localStorage.setItem('team_game_currentPlayerIdx', currentPlayerIdx);
  }, [playerCount, playerNames, currentPlayerIdx]);

  const initializePlayers = useCallback((count, names = []) => {
    const finalNames = names.length > 0 ? names : Array(count).fill('').map((_, i) => `Гравець ${i + 1}`);
    setPlayerCount(count);
    setPlayerNames(finalNames);
    setCurrentPlayerIdx(0);
  }, []);

  const nextPlayer = useCallback(() => {
    if (playerCount > 1) {
      setCurrentPlayerIdx(prev => (prev + 1) % playerCount);
    }
  }, [playerCount]);

  const resetPlayers = useCallback(() => {
    setCurrentPlayerIdx(0);
  }, []);

  const skipPlayers = useCallback(() => {
    setPlayerCount(0);
    setPlayerNames([]);
    setCurrentPlayerIdx(0);
    localStorage.removeItem('team_game_playerCount');
    localStorage.removeItem('team_game_playerNames');
    localStorage.removeItem('team_game_currentPlayerIdx');
  }, []);

  return {
    playerCount,
    playerNames,
    currentPlayer: currentPlayerIdx + 1,
    currentPlayerName: playerNames[currentPlayerIdx] || `Гравець ${currentPlayerIdx + 1}`,
    initializePlayers,
    nextPlayer,
    resetPlayers,
    skipPlayers,
  };
}
