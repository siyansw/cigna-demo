import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { providers as initialProviders, demoProviderData } from '../data/providers';
import NewsFeed from './NewsFeed';
import './CredentialDashboard.css';

const CredentialDashboard = ({ onBack }) => {
  const [providers, setProviders] = useState(initialProviders);
  const [isRunning, setIsRunning] = useState(false);
  const [showWatchLive, setShowWatchLive] = useState(false);
  const [timestamp, setTimestamp] = useState(null);

  // Load previous data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('credential-verification-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setProviders(parsed.providers);
      setTimestamp(parsed.timestamp);
    }
  }, []);

  const handleRunVerification = () => {
    setIsRunning(true);
    setShowWatchLive(true);

    // Simulate agent execution with demo data
    setTimeout(() => {
      const updatedProviders = providers.map(provider => {
        const demoData = demoProviderData[provider.npi];
        return {
          ...provider,
          npiData: demoData.npi,
          licenseData: demoData.license,
          verified: true,
          npiRetrievalTime: Math.floor(Math.random() * 2) + 1, // 1-3 seconds
          licenseRetrievalTime: Math.floor(Math.random() * 4) + 5 // 5-8 seconds
        };
      });

      setProviders(updatedProviders);
      setIsRunning(false);
      setTimestamp(new Date().toISOString());

      // Save to localStorage
      localStorage.setItem('credential-verification-data', JSON.stringify({
        providers: updatedProviders,
        timestamp: new Date().toISOString()
      }));
    }, 8000); // Simulate 8 second execution
  };

  const handleRefresh = () => {
    handleRunVerification();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="credential-dashboard">
      {/* Header with back button */}
      <div className="credential-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Menu
        </button>
      </div>

      {/* Hero Section */}
      <motion.div
        className="credential-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="credential-title">
          Cigna Provider Credential Verification
        </h1>
        <p className="credential-subtitle">
          Real-time automated credentialing at scale
        </p>

        <div className="credential-actions">
          <button
            className={`run-button ${isRunning ? 'running' : ''}`}
            onClick={handleRunVerification}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Clock size={20} className="animate-pulse" />
                Running Verification...
              </>
            ) : (
              <>
                <Play size={20} />
                Run Verification
              </>
            )}
          </button>

          {showWatchLive && (
            <motion.button
              className="watch-live-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="live-indicator"></span>
              Watch Live
            </motion.button>
          )}

          {timestamp && !isRunning && (
            <button className="refresh-button" onClick={handleRefresh}>
              <RefreshCw size={18} />
              Refresh
            </button>
          )}
        </div>

        {timestamp && (
          <p className="credential-timestamp">
            Last updated: {formatTimestamp(timestamp)}
          </p>
        )}
      </motion.div>

      {/* Provider Cards */}
      <div className="provider-cards">
        {providers.map((provider, index) => (
          <motion.div
            key={provider.id}
            className="provider-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="provider-card-header">
              <div>
                <h3 className="provider-name">
                  {provider.name}, {provider.credentials}
                </h3>
                <p className="provider-specialty">{provider.specialty}</p>
              </div>
              {provider.verified && (
                <div className="verification-badge verified">
                  <CheckCircle size={18} />
                  VERIFIED
                </div>
              )}
            </div>

            {provider.verified ? (
              <div className="provider-card-body">
                {/* NPI Data */}
                <div className="verification-section">
                  <div className="section-header">
                    <CheckCircle size={16} className="text-green" />
                    <span className="section-title">NPI Verified</span>
                  </div>
                  <div className="section-content">
                    <div className="data-row">
                      <span className="data-label">NPI:</span>
                      <span className="data-value">{provider.npiData.npi}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Specialty:</span>
                      <span className="data-value">{provider.npiData.taxonomy}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Status:</span>
                      <span className="data-value status-active">{provider.npiData.status}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Retrieved:</span>
                      <span className="data-value">{provider.npiRetrievalTime} sec</span>
                    </div>
                  </div>
                </div>

                {/* License Data */}
                <div className="verification-section">
                  <div className="section-header">
                    <CheckCircle size={16} className="text-green" />
                    <span className="section-title">TX License Active</span>
                  </div>
                  <div className="section-content">
                    <div className="data-row">
                      <span className="data-label">License #:</span>
                      <span className="data-value">{provider.licenseData.licenseNumber}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Status:</span>
                      <span className="data-value status-active">{provider.licenseData.licenseStatus}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Expires:</span>
                      <span className="data-value">{formatDate(provider.licenseData.expirationDate)}</span>
                    </div>
                    <div className="data-row">
                      <span className="data-label">Retrieved:</span>
                      <span className="data-value">{provider.licenseRetrievalTime} sec</span>
                    </div>
                  </div>
                </div>

                {/* Disciplinary Actions */}
                <div className="verification-section">
                  <div className="section-header">
                    <CheckCircle size={16} className="text-green" />
                    <span className="section-title">No Disciplinary Actions</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="provider-card-placeholder">
                <p className="placeholder-text">
                  Click "Run Verification" to check credentials
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Scalability Section */}
      {providers.some(p => p.verified) && (
        <motion.div
          className="scalability-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="scalability-title">Scale to Thousands of Providers</h3>
          <p className="scalability-description">
            This demo verifies 2 providers in ~8 seconds. TinyFish can parallelize to verify 100+ providers
            simultaneously, completing 1,000 provider credentialing checks in under 2 minutes.
          </p>
          <div className="scalability-stats">
            <div className="stat-card">
              <div className="stat-value">2 providers</div>
              <div className="stat-label">~8 seconds</div>
            </div>
            <div className="stat-divider">→</div>
            <div className="stat-card">
              <div className="stat-value">100 providers</div>
              <div className="stat-label">~15 seconds</div>
            </div>
            <div className="stat-divider">→</div>
            <div className="stat-card">
              <div className="stat-value">1,000 providers</div>
              <div className="stat-label">~2 minutes</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* News Feed */}
      <NewsFeed type="credential" />
    </div>
  );
};

export default CredentialDashboard;
