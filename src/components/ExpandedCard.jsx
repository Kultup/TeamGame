import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

export default function ExpandedCard({ 
  question, 
  category, 
  onClose
}) {
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
