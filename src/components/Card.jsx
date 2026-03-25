import React from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { getIconByName } from '../constants/icons';
import { Sparkles } from 'lucide-react';

const Card = React.memo(React.forwardRef(({ question, category, isFlipped, onFlip, index }, ref) => {
  const Icon = getIconByName(category?.icon);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`card-container ${isFlipped ? 'is-flipped' : ''}`}
      onClick={() => !isFlipped && onFlip(question.id, question)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      style={{ 
        cursor: isFlipped ? 'default' : 'pointer',
        rotateX: isFlipped ? 0 : rotateX,
        rotateY: isFlipped ? 180 : rotateY,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        '--accent-glow': category?.color 
      }}
      whileHover={!isFlipped ? { scale: 1.05 } : {}}
      whileTap={!isFlipped ? { scale: 0.95 } : {}}
    >
      <div className="card-flipper">
        <div
          className="card-face card-front glass"
          style={{
            background: `linear-gradient(135deg, ${category?.color || '#3b82f6'}33, ${category?.color || '#3b82f6'}11)`,
            borderColor: `${category?.color || '#3b82f6'}66`
          }}
        >
          <div className="card-number">#{index + 1}</div>
          <div className="card-shine" />
          <Icon size={48} color={category?.color || '#3b82f6'} strokeWidth={1.5} />
          <span className="card-label">{category?.name || 'Категорія'}</span>
          <span className="card-mini-text">Натисніть, щоб відкрити</span>
        </div>

        <div
          className="card-face card-back glass"
          style={{
            borderColor: `${category?.color || '#3b82f6'}88`,
            background: `linear-gradient(135deg, #0f172a, ${category?.color}22)`
          }}
        >
          <div className="card-back-content">
            <p className={`card-question ${
              question.text.length > 1000 ? 'text-micro' :
              question.text.length > 700 ? 'text-tiny' :
              question.text.length > 400 ? 'q-extra-mini' :
              question.text.length > 250 ? 'q-mini' : 
              question.text.length > 120 ? 'q-small' : ''
            }`}>
              {question.text}
            </p>
          </div>
          <div className="card-back-footer" style={{ color: category?.color }}>
            {category?.name}
          </div>
        </div>
      </div>
    </motion.div>
  );
}));

Card.displayName = 'Card';

const particlesCache = new Map();

const generateParticles = (key) => {
  if (particlesCache.has(key)) return particlesCache.get(key);
  
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 2,
    duration: Math.random() * 3 + 3,
  }));
  
  particlesCache.set(key, particles);
  return particles;
};

export const ExpandedCard = React.memo(({ question, category, onClose }) => {
  const Icon = getIconByName(category?.icon);
  const particles = generateParticles(category?.id || 'default');

  return (
    <AnimatePresence>
      {question && (
        <>
          <motion.div
            className="expanded-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          <motion.div
            className="expanded-card"
            initial={{ clipPath: 'circle(0% at 50% 50%)' }}
            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
            exit={{ clipPath: 'circle(0% at 50% 50%)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: `radial-gradient(ellipse at top, ${category?.color}30, #0f172a 70%)`,
            }}
          >
            {particles.map(p => (
              <motion.div
                key={p.id}
                className="particle"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background: category?.color,
                }}
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}

            <motion.div
              className="glow-ring"
              style={{ boxShadow: `0 0 120px 40px ${category?.color}33` }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            <motion.button
              className="expanded-close"
              onClick={onClose}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.2, rotate: 90 }}
            >
              <motion.span style={{ display: 'block' }} whileHover={{ rotate: 180 }}>✕</motion.span>
            </motion.button>

            <div className="expanded-content">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <Icon size={72} color={category?.color} strokeWidth={1.5} />
              </motion.div>

              <motion.div
                className="expanded-sparkle-row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <Sparkles size={16} color={category?.color} />
                <span className="expanded-category" style={{ color: category?.color }}>
                  {category?.name}
                </span>
                <Sparkles size={16} color={category?.color} />
              </motion.div>

              <motion.div
                className="expanded-divider"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                style={{ background: `linear-gradient(to right, transparent, ${category?.color}88, transparent)` }}
              />

              <motion.p
                className="expanded-text"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {question.text}
              </motion.p>



              <motion.button
                className="expanded-dismiss"
                onClick={onClose}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: `linear-gradient(135deg, ${category?.color}44, ${category?.color}22)`,
                  borderColor: `${category?.color}66`,
                }}
              >
                Зрозуміло
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

ExpandedCard.displayName = 'ExpandedCard';

export default Card;
