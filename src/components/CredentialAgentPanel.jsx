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

  // Build agent list from providers
  const agents = [];
  providers.forEach(provider => {
    agents.push({
      id: `npi-${provider.id}`,
      name: `NPI Check - ${provider.name}`,
      icon: FileCheck,
      status: provider.npiVerified ? 'complete' : (isRunning ? 'running' : 'pending'),
      progress: provider.npiVerified ? 100 : (isRunning ? 50 : 0),
      result: provider.npiVerified ? 'Verified' : 'Pending',
      streamingUrl: agentProgress?.[`npiRegistry-${provider.id}`]?.streamingUrl
    });
    agents.push({
      id: `license-${provider.id}`,
      name: `License Check - ${provider.name}`,
      icon: Shield,
      status: provider.licenseVerified ? 'complete' : (isRunning ? 'running' : 'pending'),
      progress: provider.licenseVerified ? 100 : (isRunning ? 50 : 0),
      result: provider.licenseVerified ? 'Verified' : 'Pending',
      streamingUrl: agentProgress?.[`texasMedicalBoard-${provider.id}`]?.streamingUrl
    });
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
