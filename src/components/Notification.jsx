import React from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export { useNotifications };

const Notification = ({ message, type = 'info', onClose }) => {
  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
  };

  const colors = {
    error: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#f87171' },
    success: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#4ade80' },
    info: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)', text: '#60a5fa' },
  };

  const Icon = icons[type] || Info;
  const color = colors[type] || colors.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className={`notification notification-${type}`}
    >
      <Icon size={20} />
      <span className="notification-message">{message}</span>
      <button onClick={onClose} className="notification-close">
        <X size={16} />
      </button>
    </motion.div>
  );
};

export default Notification;
