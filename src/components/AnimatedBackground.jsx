import React from 'react';
import { motion } from 'framer-motion';

const blobs = [
  { color: '#3b82f6', size: 400, x: '10%', y: '20%', duration: 20 },
  { color: '#ec4899', size: 350, x: '80%', y: '10%', duration: 25 },
  { color: '#8b5cf6', size: 300, x: '60%', y: '70%', duration: 22 },
  { color: '#14b8a6', size: 250, x: '20%', y: '80%', duration: 18 },
  { color: '#f59e0b', size: 200, x: '50%', y: '40%', duration: 30 },
];

const AnimatedBackground = () => {
  return (
    <div className="blobs-container">
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="blob"
          style={{
            width: blob.size,
            height: blob.size,
            left: blob.x,
            top: blob.y,
            background: `radial-gradient(circle, ${blob.color}30, transparent 70%)`,
          }}
          animate={{
            x: [0, 80, -60, 40, 0],
            y: [0, -60, 40, -80, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
