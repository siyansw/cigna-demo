import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PasswordScreen from './components/PasswordScreen';
import LandingMenu from './components/LandingMenu';
import CredentialDashboard from './components/CredentialDashboard';
import Dashboard from './components/Dashboard';
import DrugDetail from './components/DrugDetail';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('landing'); // landing, credential-verification, pt-intelligence, drug-detail
  const [selectedDrugId, setSelectedDrugId] = useState(null);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
  };

  const handleNavigate = (view, drugId) => {
    if (view === 'drug-detail' && drugId) {
      setSelectedDrugId(drugId);
    }
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('pt-intelligence');
  };

  const handleBackToLanding = () => {
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
            onBack={handleBackToLanding}
          />
        )}
        {currentView === 'pt-intelligence' && (
          <Dashboard
            key="pt-dashboard"
            onBack={handleBackToLanding}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'drug-detail' && (
          <DrugDetail
            key="drug-detail"
            drugId={selectedDrugId}
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
