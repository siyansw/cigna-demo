import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  CheckCircle,
  Clock,
  FileCheck,
  Shield,
  Loader2,
  Video
} from 'lucide-react';
import minoApi from '../services/minoApi';
import StreamViewer from './StreamViewer';
import './AgentPanel.css';

const MODE = minoApi.MODE;

const CredentialAgentPanel = ({ providers, isRunning, agentProgress, onWatchLive }) => {
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [viewingStream, setViewingStream] = useState(null);

  console.log('🎛️ CredentialAgentPanel - isRunning:', isRunning);
  console.log('🎛️ CredentialAgentPanel - agentProgress:', agentProgress);

  // Build agent list from providers
  const agents = [];
  providers.forEach(provider => {
    const npiAgentKey = `npiRegistry-${provider.id}`;
    const licenseAgentKey = `texasMedicalBoard-${provider.id}`;

    const npiProgress = agentProgress?.[npiAgentKey];
    const licenseProgress = agentProgress?.[licenseAgentKey];

    console.log(`🔍 Provider ${provider.id} - npiProgress:`, npiProgress);
    console.log(`🔍 Provider ${provider.id} - licenseProgress:`, licenseProgress);

    // NPI Agent
    const npiStatus = provider.npiVerified ? 'complete' :
                      (npiProgress?.status === 'running' ? 'running' :
                       (isRunning ? 'pending' : 'pending'));

    const npiAgent = {
      id: `npi-${provider.id}`,
      name: `NPI Check - ${provider.name}`,
      icon: FileCheck,
      status: npiStatus,
      progress: provider.npiVerified ? 100 : (npiProgress?.progress || 0),
      result: provider.npiVerified ? 'Verified' : (npiStatus === 'running' ? 'Processing...' : 'Pending'),
      streamingUrl: npiProgress?.streamingUrl
    };

    console.log(`🔍 NPI Agent for ${provider.name}:`, npiAgent);
    agents.push(npiAgent);

    // License Agent
    const licenseStatus = provider.licenseVerified ? 'complete' :
                          (licenseProgress?.status === 'running' ? 'running' :
                           (isRunning ? 'pending' : 'pending'));

    const licenseAgent = {
      id: `license-${provider.id}`,
      name: `License Check - ${provider.name}`,
      icon: Shield,
      status: licenseStatus,
      progress: provider.licenseVerified ? 100 : (licenseProgress?.progress || 0),
      result: provider.licenseVerified ? 'Verified' : (licenseStatus === 'running' ? 'Processing...' : 'Pending'),
      streamingUrl: licenseProgress?.streamingUrl
    };

    console.log(`🔍 License Agent for ${provider.name}:`, licenseAgent);
    agents.push(licenseAgent);
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return <CheckCircle size={16} className="text-green" />;
      case 'running':
        return <Loader2 size={16} className="spinning text-cyan" />;
      default:
        return <Clock size={16} className="text-muted" />;
    }
  };

  return (
    <aside className="agent-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Bot size={18} />
          <span>Credential Agents</span>
          <span className={`mode-badge ${MODE}`}>
            {MODE === 'demo' ? '📊 Demo' : '🔴 Live'}
          </span>
        </div>
      </div>

      <div className="agents-list">
        {agents.map(agent => {
          const hasStream = agent.streamingUrl && MODE === 'live';

          if (hasStream) {
            console.log(`✅ Agent ${agent.name} has stream:`, agent.streamingUrl);
          }

          return (
            <div
              key={agent.id}
              className={`agent-item ${agent.status}`}
            >
              <div
                className="agent-main"
                onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
              >
                <div className="agent-icon">
                  <agent.icon size={16} />
                </div>
                <div className="agent-info">
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-result">
                    {agent.status === 'running' ? (
                      <span className="text-cyan">Processing...</span>
                    ) : (
                      agent.result
                    )}
                  </div>
                </div>
                <div className="agent-status">
                  {getStatusIcon(agent.status)}
                </div>
              </div>

              {/* Watch Live Button */}
              {hasStream && (
                <motion.button
                  className="watch-live-btn"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onWatchLive) {
                      onWatchLive(agent.streamingUrl, agent.name);
                    }
                    setViewingStream({ url: agent.streamingUrl, name: agent.name });
                  }}
                >
                  <Video size={14} />
                  <span>Watch Live</span>
                  <span className="live-pulse-dot"></span>
                </motion.button>
              )}

              {agent.status === 'running' && (
                <div className="agent-progress">
                  <div className="progress-bar">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="progress-text">{agent.progress}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="panel-stats">
        <div className="stat-row">
          <span className="stat-label">Total providers:</span>
          <span className="stat-value">{providers.length}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Verified:</span>
          <span className="stat-value">{providers.filter(p => p.verified).length}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Active licenses:</span>
          <span className="stat-value">{providers.filter(p => p.licenseData?.license_status === 'Active').length}</span>
        </div>
      </div>

      {/* Stream Viewer */}
      {viewingStream && (
        <StreamViewer
          streamUrl={viewingStream.url}
          agentName={viewingStream.name}
          agentIcon={FileCheck}
          onClose={() => setViewingStream(null)}
        />
      )}
    </aside>
  );
};

export default CredentialAgentPanel;
