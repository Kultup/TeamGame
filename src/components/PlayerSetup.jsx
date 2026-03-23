import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ChevronLeft, ClipboardList } from 'lucide-react';
import { PLAYER_COUNTS } from '../constants/categories';

const PlayerSetup = React.memo(({ onSelect, onSkip }) => {
  const [step, setStep] = useState('count'); // 'count' or 'names'
  const [count, setCount] = useState(0);
  const [names, setNames] = useState([]);
  const [manualValue, setManualValue] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');

  const handleCountSelect = (n) => {
    setCount(n);
    setNames(Array(n).fill('').map((_, i) => `Гравець ${i + 1}`));
    setStep('names');
  };

  const handleManualSubmit = () => {
    const value = parseInt(manualValue, 10);
    if (value >= 1 && value <= 20) {
      handleCountSelect(value);
    }
  };

  const handleNameChange = (index, value) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleStartGame = () => {
    const finalNames = names.map((name, i) => name.trim() || `Гравець ${i + 1}`);
    onSelect(count, finalNames);
  };

  const handleBulkImport = () => {
    const imported = importText
      .split(/[\n,]+/)
      .map(n => n.trim())
      .filter(n => n.length > 0);
    
    if (imported.length > 0) {
      setCount(imported.length);
      setNames(imported);
      setStep('names');
      setShowImport(false);
      setImportText('');
    }
  };

  if (step === 'names') {
    return (
      <motion.div
        className="player-setup animate-fade-in"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h2 className="subtitle">
          <UserPlus size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Як звати гравців?
        </h2>
        <div className="names-grid glass">
          {names.map((name, i) => (
            <div key={i} className="name-input-group">
              <label>Гравець {i + 1}</label>
              <input
                type="text"
                className="glass name-input"
                placeholder={`Гравець ${i + 1}`}
                value={name.startsWith('Гравець ') ? '' : name}
                onChange={(e) => handleNameChange(i, e.target.value)}
                autoFocus={i === 0}
              />
            </div>
          ))}
        </div>
        <div className="setup-actions">
          <button className="btn-link" onClick={() => setStep('count')}>
            <ChevronLeft size={18} /> Назад
          </button>
          <motion.button
            className="glass submit-btn"
            style={{ marginTop: 0, padding: '0.8rem 2.5rem !important' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
          >
            Розпочати гру
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="player-setup animate-fade-in"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="subtitle">
        <UserPlus size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Скільки гравців?
      </h2>
      <div className="player-grid">
        {PLAYER_COUNTS.map(n => (
          <motion.button
            key={n}
            className="glass player-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCountSelect(n)}
          >
            {n}
          </motion.button>
        ))}
      </div>
      <div className="manual-input-row">
        <span className="manual-label">або введіть:</span>
        <input
          type="number"
          min="1"
          max="20"
          className="glass manual-input"
          placeholder="5"
          value={manualValue}
          onChange={(e) => setManualValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleManualSubmit();
          }}
        />
        <motion.button
          className="glass manual-submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleManualSubmit}
        >
          →
        </motion.button>
      </div>
      <motion.button
        className="glass skip-btn"
        whileHover={{ scale: 1.03 }}
        onClick={onSkip}
      >
        Пропустити
      </motion.button>

      <div className="import-toggle-container">
        <button className="btn-link" onClick={() => setShowImport(!showImport)}>
          <ClipboardList size={18} /> {showImport ? 'Сховати імпорт' : 'Імпортувати список імен'}
        </button>
      </div>

      {showImport && (
        <motion.div 
          className="bulk-import-area glass"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <textarea
            className="glass import-textarea"
            placeholder="Вставте імена через кому або з нового рядка..."
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <button className="glass submit-btn small" onClick={handleBulkImport}>
            Імпортувати
          </button>
        </motion.div>
      )}
    </motion.div>
  );
});

PlayerSetup.displayName = 'PlayerSetup';

export default PlayerSetup;
