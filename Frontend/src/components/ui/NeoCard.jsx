import React from 'react';
import { motion } from 'framer-motion';

export const NeoCard = ({ children, className = "" }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`neo-flat p-8 rounded-[40px] bg-[#e0e5ec] ${className}`}
  >
    {children}
  </motion.div>
);