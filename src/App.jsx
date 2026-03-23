import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shuffle, Sparkles, ChevronLeft,
  X, Settings, LogOut, Volume2, VolumeX, Info, RefreshCw
} from 'lucide-react';

// Components
import Card from './components/Card';
import AnimatedBackground from './components/AnimatedBackground';
import Notification, { useNotifications } from './components/Notification';
import PlayerSetup from './components/PlayerSetup';
import AdminPanel from './components/AdminPanel';
import ExpandedCard from './components/ExpandedCard';
import Rules from './components/Rules';

const CountdownTimer = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(Math.max(0, expiresAt - Date.now()));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = Math.max(0, expiresAt - Date.now());
      setTimeLeft(newTime);
      if (newTime === 0) {
        clearInterval(timer);
        onExpire();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  if (timeLeft === 0) return null;

  const minutes = Math.floor(timeLeft / 1000 / 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="mod-timer">
      ({minutes}:{seconds.toString().padStart(2, '0')})
    </span>
  );
};

// Constants
import { getIconByName } from './constants/icons';
import logo from './assets/logo.png';

// Hooks
import {
  useGameData,
  useGameLogic,
  usePlayerManagement,
  useAudio,
  useAdminAuth,
} from './hooks';



export default function App() {
  const { 
    error: notifyError, 
    success: notifySuccess, 
    info: notifyInfo, 
    notifications: currentNotifications, 
    removeNotification 
  } = useNotifications();
  const lastErrorRef = useRef(null);

  const [currentView, setCurrentView] = useState(() => localStorage.getItem('team_game_view') || 'players'); // 'players' | 'game' | 'admin' | 'rules'
  const [previousView, setPreviousView] = useState('players');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    localStorage.setItem('team_game_view', currentView);
  }, [currentView]);

  const {
    loading,
    error: apiError,
    categories,
    questions,
    questionCounts,
    addCategory,
    updateCategory,
    deleteCategory,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  } = useGameData();

  const {
    selectedCategory,
    expandedCard,
    gameQuestions,
    handleFlip,
    handleCloseExpanded,
    handleReset,
    handleCategorySelect,
    handleRandomCard,
    activeModifiers,
    isCardFlipped,
    clearModifiers,
    removeModifier
  } = useGameLogic(questions);

  const { playerCount, currentPlayer, currentPlayerName, initializePlayers, nextPlayer, skipPlayers } = usePlayerManagement();
  const { isMuted, toggleMute, playClickSound, playFlipSound } = useAudio();
  const { isAuthenticated, showLogin, password, setPassword, error: authError, login, openLogin, closeLogin } = useAdminAuth();

  // Mouse Parallax Logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync API errors to notification system
  useEffect(() => {
    if (apiError && apiError !== lastErrorRef.current) {
      notifyError(apiError);
      lastErrorRef.current = apiError;
    } else if (!apiError) {
      lastErrorRef.current = null;
    }
  }, [apiError, notifyError]);

  const handleStartGame = (count, names) => {
    initializePlayers(count, names);
    setCurrentView('game');
    playClickSound();
  };

  const handleFlipWithSound = useCallback((id, question) => {
    playFlipSound();
    handleFlip(id, question);
  }, [playFlipSound, handleFlip]);

  const handleNextTurn = useCallback(() => {
    if (playerCount > 1) {
      nextPlayer();
    }

    // Завжди повертатися на вибір категорій після відкриття картки
    handleCategorySelect(null);
    handleCloseExpanded();
    playClickSound();
  }, [playerCount, nextPlayer, handleCategorySelect, handleCloseExpanded, playClickSound]);

  const handleResetSession = useCallback(() => {
    if (window.confirm('Ви впевнені, що хочете завершити гру та скинути весь прогрес?')) {
      handleReset();
      skipPlayers();
      handleCategorySelect(null);
      setCurrentView('players');
      playClickSound();
    }
  }, [handleReset, skipPlayers, handleCategorySelect, setCurrentView, playClickSound]);


  const playInteraction = useCallback(() => {
    playClickSound();
  }, [playClickSound]);

  // Early return for loading should come AFTER all hooks
  if (loading) return <div className="loading">Завантаження...</div>;

  return (
    <div className="app-container">
      <AnimatedBackground />

      {/* Visual Parallax Background Element */}
      <motion.div
        className="parallax-bg-glow"
        animate={{
          x: mousePos.x * 2,
          y: mousePos.y * 2,
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <AnimatePresence>
        {currentNotifications.map(n => (
          <Notification
            key={n.id}
            message={n.message}
            type={n.type}
            onClose={() => removeNotification(n.id)}
          />
        ))}
      </AnimatePresence>

      <div className="main-content">
        <header className="header glass">
          <div className="header-brand">
            <motion.div
              className="logo-wrapper"
              animate={{ rotate: mousePos.x * 0.5 }}
            >
              <img src={logo} alt="Logo" className="header-logo" />
            </motion.div>

            {currentView === 'game' && playerCount > 0 && (
              <motion.div
                className="turn-indicator header-turn side-indicator"
                key={currentPlayer}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="player-badge">{currentPlayerName}</div>
                <span className="turn-text" style={{ fontSize: '12px', opacity: 0.8 }}>ваш хід!</span>
              </motion.div>
            )}
          </div>

          <div className="header-middle">
            {currentView === 'game' && (
              <motion.button
                className="glass random-toggle magic-btn"
                onClick={() => { playInteraction(); handleRandomCard(); }}
                title="Випадкове питання зі всіх категорій"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)',
                  borderColor: 'rgba(168, 85, 247, 0.8)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ display: 'flex' }}
                >
                  <Shuffle size={18} className="shuffle-icon" />
                </motion.div>
                <span className="random-text">Випадкове питання</span>
                <Sparkles size={14} className="sparkle-icon" style={{ opacity: 0.7 }} />
              </motion.button>
            )}
          </div>

          <div className="header-actions">
            {/* Reset button removed per user request */}

            <button
              className="glass icon-btn volume-toggle"
              onClick={toggleMute}
              title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            {currentView === 'game' && (
              <button
                className="glass icon-btn reset-toggle"
                onClick={handleResetSession}
                title="Завершити гру та скинути сесію"
                style={{ color: '#ef4444' }}
              >
                <LogOut size={20} />
              </button>
            )}

            <button
              className={`glass icon-btn rules-toggle ${currentView === 'rules' ? 'active' : ''}`}
              onClick={() => {
                if (currentView !== 'rules') {
                  setPreviousView(currentView);
                  setCurrentView('rules');
                } else {
                  setCurrentView(previousView);
                }
                playInteraction();
              }}
              title="Правила гри"
            >
              <Info size={20} />
            </button>



            <motion.button
              className={`glass admin-toggle ${isAuthenticated ? 'active' : ''}`}
              onClick={isAuthenticated ? () => setCurrentView('admin') : openLogin}
              title="Координатор"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex' }}
              >
                <Settings size={20} />
              </motion.div>
            </motion.button>
          </div>
        </header>

        {activeModifiers.length > 0 && currentView === 'game' && (
          <motion.div 
            className="active-modifiers-banner glass"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
          >
            <div className="modifiers-content">
              <div className="modifiers-header">
                <RefreshCw size={16} className="spin-slow" />
                <span>Активні зміни курсу:</span>
              </div>
              <ul className="modifiers-list">
                {activeModifiers.map((mod) => (
                  <motion.li 
                    key={mod.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <div className="mod-item">
                      <span>{mod.text}</span>
                      {mod.expiresAt && (
                        <CountdownTimer 
                          expiresAt={mod.expiresAt} 
                          onExpire={() => removeModifier(mod.id)} 
                        />
                      )}
                      <button 
                        className="mod-remove-btn" 
                        onClick={() => removeModifier(mod.id)}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
              <button 
                className="clear-modifiers-btn" 
                onClick={clearModifiers}
                title="Скасувати всі зміни"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">


          {currentView === 'players' && (
            <PlayerSetup
              key="players"
              onSelect={handleStartGame}
              onSkip={() => { skipPlayers(); setCurrentView('game'); }}
            />
          )}

          {currentView === 'game' && (
            <motion.div
              key="game"
              className="view-container game-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >


              {!selectedCategory ? (
                <motion.div
                  className="category-dashboard"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                  }}
                >
                  <h2 className="dashboard-title">Оберіть категорію</h2>
                  <div className="dashboard-grid">
                    {categories.map((cat) => {
                      const Icon = getIconByName(cat.icon);
                      return (
                        <motion.div
                          key={cat.id}
                          className="category-card glass"
                          variants={{
                            hidden: { opacity: 0, scale: 0.8, y: 20 },
                            visible: { opacity: 1, scale: 1, y: 0 }
                          }}
                          whileHover={{ scale: 1.05, y: -10 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => { playInteraction(); handleCategorySelect(cat.id); }}
                          style={{ '--cat-color': cat.color }}
                        >
                          <div className="cat-icon-wrapper" style={{ background: `${cat.color}22` }}>
                            <Icon size={40} color={cat.color} />
                          </div>
                          <div className="cat-info">
                            <h3>{cat.name}</h3>
                            <span className="cat-count">
                              {questionCounts[cat.id] || 0} питань
                            </span>
                          </div>
                          <div className="cat-glow" style={{ background: `radial-gradient(circle at center, ${cat.color}33, transparent 70%)` }} />
                        </motion.div>
                      );
                    })}


                  </div>
                </motion.div>
              ) : (
                <div className="active-game-area">
                  <button className="back-link" onClick={() => { handleCategorySelect(null); }}>
                    <ChevronLeft size={20} /> Всі категорії
                  </button>

                  <div className="questions-container">
                    <AnimatePresence mode="popLayout">
                      {gameQuestions.map((q, idx) => (
                        <Card
                          key={q.id}
                          question={q}
                          index={idx}
                          category={categories.find(c => c.id === q.category)}
                          isFlipped={isCardFlipped(q.id)}
                          onFlip={() => handleFlipWithSound(q.id, q)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>


                </div>
              )}
            </motion.div>
          )}

          {currentView === 'admin' && (
            <AdminPanel
              key="admin"
              categories={categories}
              questions={questions}
              questionCounts={questionCounts}
              onAddCategory={addCategory}
              onUpdateCategory={updateCategory}
              onDeleteCategory={deleteCategory}
              onAddQuestion={addQuestion}
              onUpdateQuestion={updateQuestion}
              onDeleteQuestion={deleteQuestion}
              onBack={() => setCurrentView('players')}
              notify={{ error: notifyError, success: notifySuccess, info: notifyInfo }}
            />
          )}

          {currentView === 'rules' && (
            <Rules
              key="rules"
              onBack={() => setCurrentView(previousView)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Expanded Card View */}
      <AnimatePresence>
        {expandedCard && (
          <ExpandedCard
            question={expandedCard}
            category={categories.find(c => c.id === expandedCard.category)}
            onClose={handleNextTurn}
          />
        )}
      </AnimatePresence>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-box glass card-glass"
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
            >
              <div className="modal-top">
                <h3>Доступ координатора</h3>
                <button className="close-btn" onClick={closeLogin}><X size={20} /></button>
              </div>
              <div className="modal-form">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введіть пароль"
                  className="glass"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && login(password)) {
                      closeLogin();
                      setTimeout(() => setCurrentView('admin'), 300);
                    }
                  }}
                />
                {authError && <p className="error-hint">{authError}</p>}
                <button
                  className="glass primary-btn"
                  onClick={() => {
                    if (login(password)) {
                      closeLogin();
                      setTimeout(() => setCurrentView('admin'), 300);
                    }
                  }}
                >
                  Увійти
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
