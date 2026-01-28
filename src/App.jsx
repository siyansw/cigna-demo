import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PasswordScreen from './components/PasswordScreen';
import LandingMenu from './components/LandingMenu';
import CredentialDashboard from './components/CredentialDashboard';
import PTDashboard from './components/PTDashboard';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); // landing, credential-verification, pt-intelligence

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
  };

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('landing');
  };

  if (!isAuthenticated) {
    return <PasswordScreen onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <LandingMenu
            key="landing"
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'credential-verification' && (
          <CredentialDashboard
            key="credential"
            onBack={handleBack}
          />
        )}
        {currentView === 'pt-intelligence' && (
          <PTDashboard
            key="pt-dashboard"
            onBack={handleBack}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
