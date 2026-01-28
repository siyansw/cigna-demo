import { useState } from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import './PasswordScreen.css';

const PasswordScreen = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'optum2026' || password === 'tinyfish2026') {
      onAuthenticate();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="password-screen">
      <motion.div
        className="password-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="password-icon">
          <Lock size={28} />
        </div>

        <h1 className="password-title">
          Optum Rx <span className="text-cyan">× TinyFish</span>
        </h1>

        <p className="password-subtitle">Enter password to continue</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`password-input ${error ? 'error' : ''}`}
            autoFocus
          />

          <button type="submit" className="password-button">
            Enter
          </button>
        </form>

        <p className="password-footer">P&T Committee Demo</p>

        {error && (
          <motion.p
            className="password-error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Invalid password
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default PasswordScreen;
