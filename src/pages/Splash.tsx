
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding');
    }, 3000); // 3 segundos de animação

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-32 h-32 mx-auto mb-8 bg-white rounded-3xl flex items-center justify-center shadow-2xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-bold text-purple-600"
          >
            📦
          </motion.div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-4xl font-bold text-white mb-4"
        >
          ExpediApp
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="text-xl text-white/90"
        >
          Gestão inteligente de expedição
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Splash;
