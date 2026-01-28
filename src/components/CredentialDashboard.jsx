import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Zap,
  UserCheck,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  FileCheck,
  Calendar,
  MapPin,
  Phone,
  Building,
  Video
} from 'lucide-react';
import { providers as initialProviders } from '../data/providers';
import { runMultipleAgents } from '../services/minoApi';
import CredentialAgentPanel from './CredentialAgentPanel';
import WatchLiveModal from './WatchLiveModal';
import './CredentialDashboard.css';

const CredentialDashboard = ({ onBack }) => {
  const [providers, setProviders] = useState(initialProviders);
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timestamp, setTimestamp] = useState(null);
  const [agentProgress, setAgentProgress] = useState({});
  const [watchLiveModalOpen, setWatchLiveModalOpen] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);

  console.log('🏥 CredentialDashboard - Initial providers count:', initialProviders.length);
  console.log('🏥 CredentialDashboard - Current providers count:', providers.length);

  // Load previous data
  useEffect(() => {
    const savedData = localStorage.getItem('credential-verification-data');
    console.log('💾 Loading from localStorage:', savedData ? 'Found data' : 'No data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        console.log('📦 Parsed providers count:', parsed.providers?.length || 0);

        // Always use initialProviders as base, but merge in saved data for matching providers
        if (parsed.providers && parsed.providers.length > 0) {
          const mergedProviders = initialProviders.map(initialProvider => {
            const savedProvider = parsed.providers.find(p => p.id === initialProvider.id);
            return savedProvider || initialProvider;
          });
          console.log('🔄 Merged providers count:', mergedProviders.length);
          setProviders(mergedProviders);
        } else {
          console.log('⚠️ No saved providers, using initial:', initialProviders.length);
          setProviders(initialProviders);
        }
        setTimestamp(parsed.timestamp);
      } catch (e) {
        console.error('❌ Error parsing localStorage:', e);
        setProviders(initialProviders);
      }
    } else {
      console.log('✨ No saved data, using all initial providers:', initialProviders.length);
    }
  }, []);

  const handleRunVerification = async () => {
    console.log('🚀 Starting credential verification for', providers.length, 'providers');
    setIsRunning(true);
    setAgentLogs([]);
    setAgentProgress({});
    const startTime = Date.now();

    // Prepare agent configurations
    const agentConfigs = [];
    providers.forEach((provider) => {
      const nameParts = provider.name.split(' ');
      const lastName = nameParts[nameParts.length - 1];
      const firstName = nameParts[0];

      console.log(`  → Creating agents for ${provider.name} (ID: ${provider.id})`);

      // Use unique agentType identifiers that include provider ID
      agentConfigs.push({
        agentType: 'npiRegistry',
        agentId: `npiRegistry-${provider.id}`,
        params: { npiNumber: provider.npi },
        providerId: provider.id,
        providerName: provider.name
      });

      agentConfigs.push({
        agentType: 'texasMedicalBoard',
        agentId: `texasMedicalBoard-${provider.id}`,
        params: { lastName, firstName },
        providerId: provider.id,
        providerName: provider.name
      });
    });

    console.log('📋 Total agent configs created:', agentConfigs.length);
    console.log('📋 Agent configs:', agentConfigs);

    // Run all agents
    await runMultipleAgents(agentConfigs, {
      onAgentProgress: (identifier, progress) => {
        console.log(`📊 ${identifier}:`, progress.message, 'status:', progress.status);

        // Track agent progress for panel and watch live
        setAgentProgress(prev => {
          const updated = {
            ...prev,
            [identifier]: progress
          };
          console.log('📊 Updated agentProgress:', updated);
          return updated;
        });

        // Track logs for watch live modal
        setAgentLogs(prev => [...prev, {
          agent: identifier,
          message: progress.message,
          status: progress.status,
          time: ((Date.now() - startTime) / 1000).toFixed(1) + 's',
          providerId: progress.providerId,
          providerName: progress.providerName
        }]);
      },
      onAgentComplete: (identifier, result) => {
        console.log(`✅ ${identifier} completed:`, result.data);

        setProviders(prev => prev.map(provider => {
          // Match by providerId from result
          if (result.providerId !== provider.id) return provider;

          const agentType = result.agentType;

          if (agentType === 'npiRegistry') {
            return {
              ...provider,
              npiData: result.data,
              npiVerified: true
            };
          } else if (agentType === 'texasMedicalBoard') {
            return {
              ...provider,
              licenseData: result.data,
              licenseVerified: true,
              verified: true
            };
          }
          return provider;
        }));
      },
      onAllComplete: () => {
        const executionTime = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ All verification complete in ${executionTime}s`);
        setIsRunning(false);
        setLastUpdated(new Date());
        const newTimestamp = new Date().toISOString();
        setTimestamp(newTimestamp);

        // Save current state - need to use functional update to get latest providers
        setProviders(currentProviders => {
          console.log('💾 Saving to localStorage, provider count:', currentProviders.length);
          localStorage.setItem('credential-verification-data', JSON.stringify({
            providers: currentProviders,
            timestamp: newTimestamp
          }));
          return currentProviders;
        });
      }
    });
  };

  const getStatusBadge = (status) => {
    if (status === 'Active') return 'status-badge status-active';
    if (status === 'Inactive') return 'status-badge status-inactive';
    return 'status-badge status-pending';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button className="btn btn-ghost btn-icon" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-logo">
            <div className="logo-icon">
              <Zap size={14} />
            </div>
            <span>TinyFish</span>
          </div>
          <span className="header-divider">|</span>
          <span className="header-title">Cigna Provider Credentialing</span>
        </div>
        <div className="header-right">
          <div className="header-status">
            <Clock size={14} />
            <span>Last Updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => setShowAgentPanel(!showAgentPanel)}
          >
            <UserCheck size={16} />
            {showAgentPanel ? 'Hide' : 'Show'} Agents
          </button>
        </div>
      </header>

      <div className="dashboard-layout">
        {/* Main Content */}
        <main className="dashboard-main">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon verified">
                <CheckCircle size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{providers.filter(p => p.verified).length}/4</div>
                <div className="stat-label">Verified</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon active">
                <Shield size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{providers.filter(p => p.licenseData?.license_status === 'Active').length}/4</div>
                <div className="stat-label">Active Licenses</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon success">
                <FileCheck size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-value">0</div>
                <div className="stat-label">Alerts</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <TrendingUp size={20} />
              </div>
              <div className="stat-content">
                <div className="stat-value">~12s</div>
                <div className="stat-label">Avg Time</div>
              </div>
            </div>
          </div>

          {/* Provider Cards */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">Provider Credentials</h2>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {isRunning && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setWatchLiveModalOpen(true)}
                  >
                    <Video size={16} />
                    Watch Live
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  onClick={handleRunVerification}
                  disabled={isRunning}
                >
                  <RefreshCw size={16} className={isRunning ? 'spinning' : ''} />
                  {isRunning ? 'Verifying...' : 'Run Verification'}
                </button>
              </div>
            </div>

            <div className="provider-grid">
              {providers.map((provider, index) => (
                <motion.div
                  key={provider.id}
                  className="provider-card-detailed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Provider Header */}
                  <div className="provider-card-header">
                    <div className="provider-avatar">
                      {provider.credentials}
                    </div>
                    <div className="provider-info">
                      <h3 className="provider-name">{provider.name}</h3>
                      <p className="provider-specialty">{provider.specialty}</p>
                    </div>
                    {provider.verified && (
                      <div className="verification-badge success">
                        <CheckCircle size={16} />
                        Verified
                      </div>
                    )}
                  </div>

                  {/* NPI Section */}
                  <div className="credential-section">
                    <div className="credential-section-header">
                      <FileCheck size={16} />
                      <span>NPI Registry</span>
                      {provider.npiVerified && <CheckCircle size={14} className="text-green" />}
                    </div>
                    {provider.npiData ? (
                      <div className="credential-details">
                        <div className="detail-row">
                          <span className="detail-label">NPI Number</span>
                          <span className="detail-value">{provider.npiData.npi}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Taxonomy</span>
                          <span className="detail-value">{provider.npiData.taxonomy}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Status</span>
                          <span className={getStatusBadge(provider.npiData.status)}>
                            {provider.npiData.status}
                          </span>
                        </div>
                        {provider.npiData.address && (
                          <div className="detail-row">
                            <MapPin size={14} className="detail-icon" />
                            <span className="detail-value small">{provider.npiData.address}</span>
                          </div>
                        )}
                        {provider.npiData.phone && (
                          <div className="detail-row">
                            <Phone size={14} className="detail-icon" />
                            <span className="detail-value small">{provider.npiData.phone}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="credential-placeholder">Click "Run Verification" to check</p>
                    )}
                  </div>

                  {/* License Section */}
                  <div className="credential-section">
                    <div className="credential-section-header">
                      <Shield size={16} />
                      <span>TX Medical Board</span>
                      {provider.licenseVerified && <CheckCircle size={14} className="text-green" />}
                    </div>
                    {provider.licenseData ? (
                      <div className="credential-details">
                        <div className="detail-row">
                          <span className="detail-label">License Number</span>
                          <span className="detail-value">{provider.licenseData.license_number}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Status</span>
                          <span className={getStatusBadge(provider.licenseData.license_status)}>
                            {provider.licenseData.license_status}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Expires</span>
                          <span className="detail-value">{formatDate(provider.licenseData.expiration_date)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Issued</span>
                          <span className="detail-value">{formatDate(provider.licenseData.issue_date)}</span>
                        </div>
                        {provider.licenseData.medical_school && (
                          <div className="detail-row">
                            <Building size={14} className="detail-icon" />
                            <span className="detail-value small">{provider.licenseData.medical_school}</span>
                          </div>
                        )}
                        <div className="detail-row disciplinary">
                          <span className="detail-label">Disciplinary Actions</span>
                          <span className="detail-value text-green">
                            {provider.licenseData.disciplinary_actions || 'None'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="credential-placeholder">Click "Run Verification" to check</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Alerts Section */}
          {providers.some(p => p.verified) && (
            <div className="section">
              <div className="section-header">
                <h2 className="section-title">Alerts & Notifications</h2>
              </div>
              <div className="alerts-grid">
                {providers.filter(p => p.licenseData).map(provider => {
                  const expirationDate = new Date(provider.licenseData.expiration_date);
                  const today = new Date();
                  const daysUntilExpiration = Math.floor((expirationDate - today) / (1000 * 60 * 60 * 24));
                  const isExpiringSoon = daysUntilExpiration < 180;

                  if (!isExpiringSoon) return null;

                  return (
                    <div key={provider.id} className="alert-card warning">
                      <div className="alert-icon">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="alert-content">
                        <div className="alert-title">License Expiring Soon</div>
                        <div className="alert-message">
                          {provider.name}'s {provider.licenseData.state} license expires in {daysUntilExpiration} days
                        </div>
                      </div>
                      <div className="alert-badge warning">
                        {daysUntilExpiration} days
                      </div>
                    </div>
                  );
                })}
                {providers.filter(p => p.verified).length === providers.length && (
                  <div className="alert-card success">
                    <div className="alert-icon">
                      <CheckCircle size={20} />
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">All Clear</div>
                      <div className="alert-message">
                        All {providers.length} providers have active credentials with no issues
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Scalability Section */}
          {providers.some(p => p.verified) && (
            <div className="section">
              <div className="scalability-banner">
                <div className="scalability-content">
                  <h3>Scale to Thousands of Providers</h3>
                  <p>
                    This demo verifies 4 providers in ~12 seconds. TinyFish can parallelize to verify
                    100+ providers simultaneously, completing 1,000 provider credentialing checks in under 2 minutes.
                  </p>
                </div>
                <div className="scalability-stats-inline">
                  <div className="stat-inline">
                    <div className="stat-inline-value">4</div>
                    <div className="stat-inline-label">~12 sec</div>
                  </div>
                  <div className="stat-arrow">→</div>
                  <div className="stat-inline">
                    <div className="stat-inline-value">100</div>
                    <div className="stat-inline-label">~15 sec</div>
                  </div>
                  <div className="stat-arrow">→</div>
                  <div className="stat-inline">
                    <div className="stat-inline-value">1,000</div>
                    <div className="stat-inline-label">~2 min</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Agent Panel Sidebar */}
        {showAgentPanel && (
          <CredentialAgentPanel
            providers={providers}
            isRunning={isRunning}
            agentProgress={agentProgress}
          />
        )}
      </div>

      {/* Watch Live Modal */}
      <WatchLiveModal
        isOpen={watchLiveModalOpen}
        onClose={() => setWatchLiveModalOpen(false)}
        agents={Object.entries(agentProgress).map(([key, progress]) => ({
          name: key,
          status: progress.status || 'pending',
          logs: agentLogs.filter(log => log.agent === key.split('-')[0]).map(log => ({
            message: log.message,
            status: log.status,
            time: log.time
          })),
          result: progress.data
        }))}
        logs={agentLogs}
      />
    </motion.div>
  );
};

export default CredentialDashboard;
