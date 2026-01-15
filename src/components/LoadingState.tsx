import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message: string;
  subMessage?: string;
}

export function LoadingState({ message, subMessage }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="loading-state"
    >
      <Loader2 size={48} className="spinning" />
      <h3>{message}</h3>
      {subMessage && <p>{subMessage}</p>}
    </motion.div>
  );
}
