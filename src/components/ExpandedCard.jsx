import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Play, Pause, RotateCcw, Clock } from 'lucide-react';

export default function ExpandedCard({ 
  question, 
  category, 
  onClose
}) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const startTimer = (minutes) => {
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsActive(true);
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setTimeLeft(initialTime);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!question) return null;

  return (
    <motion.div 
      className="expanded-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="expanded-card glass"
        initial={{ scale: 0.8, y: 40, opacity: 0, rotateX: 10 }}
        animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.8, y: 40, opacity: 0, rotateX: 10 }}
        onClick={(e) => e.stopPropagation()}
        style={{ '--accent-color': category?.color || '#3b82f6' }}
      >
        <button className="expanded-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="expanded-content">
          <motion.div 
            className="expanded-category" 
            style={{ color: category?.color || '#3b82f6' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {category?.name || 'Категорія'}
          </motion.div>
          
          <motion.h2 
            className="expanded-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {question.text}
          </motion.h2>

          {/* Discussion Timer Section */}
          <motion.div 
            className="discussion-timer-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {timeLeft > 0 ? (
              <div className="active-timer">
                <div className="timer-display">
                  <div className="timer-circle">
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="timer-bg" />
                      <motion.circle 
                        cx="50" cy="50" r="45" 
                        className="timer-progress"
                        initial={{ pathLength: 1 }}
                        animate={{ pathLength: timeLeft / initialTime }}
                        style={{ stroke: category?.color }}
                      />
                    </svg>
                    <span className="timer-number">{formatTime(timeLeft)}</span>
                  </div>
                </div>
                <div className="timer-controls">
                  <button className="timer-btn primary" onClick={toggleTimer}>
                    {isActive ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button className="timer-btn secondary" onClick={resetTimer}>
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="timer-selection">
                <div className="timer-label">
                  <Clock size={16} /> <span>Обговорення:</span>
                </div>
                <div className="timer-options">
                  <button className="timer-opt-btn" onClick={() => startTimer(1)}>1 хв</button>
                  <button className="timer-opt-btn" onClick={() => startTimer(2)}>2 хв</button>
                  <button className="timer-opt-btn" onClick={() => startTimer(3)}>3 хв</button>
                </div>
              </div>
            )}
          </motion.div>

          <div className="expanded-footer">
            <button className="primary-btn" onClick={onClose} style={{ marginTop: '1rem' }}>
              Наступний хід <ChevronRight size={20} style={{ marginLeft: '8px' }} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
