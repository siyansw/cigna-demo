import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PasswordScreen from './components/PasswordScreen';
import Presentation from './components/Presentation';
import Dashboard from './components/Dashboard';
import DrugDetail from './components/DrugDetail';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('presentation'); // presentation, dashboard, drug-detail
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedDrug, setSelectedDrug] = useState(null);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
  };

  const handleNavigate = (view, drugId = null) => {
    setCurrentView(view);
    if (drugId) {
      setSelectedDrug(drugId);
    }
  };

  const handleBack = () => {
    if (currentView === 'drug-detail') {
      setCurrentView('dashboard');
      setSelectedDrug(null);
    } else if (currentView === 'dashboard') {
      setCurrentView('presentation');
      setCurrentSlide(2); // Go back to "Live Demo" slide
    }
  };

  if (!isAuthenticated) {
    return <PasswordScreen onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {currentView === 'presentation' && (
          <Presentation
            key="presentation"
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            onNavigate={handleNavigate}
          />
        )}
        {currentView === 'dashboard' && (
          <Dashboard
            key="dashboard"
            onNavigate={handleNavigate}
            onBack={handleBack}
          />
        )}
        {currentView === 'drug-detail' && (
          <DrugDetail
            key="drug-detail"
            drugId={selectedDrug}
            onBack={handleBack}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
