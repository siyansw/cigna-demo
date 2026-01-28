import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  FileText,
  AlertTriangle,
  Search,
  Users,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useState } from 'react';
import './BrowserStreams.css';

const AGENT_ICONS = {
  evidence: Database,
  guidelines: FileText,
  safety: AlertTriangle,
  comparator: Users,
  formulary: Search
};

const AGENT_NAMES = {
  evidence: 'Evidence Gathering',
  guidelines: 'Guideline Monitoring',
  safety: 'Safety Surveillance',
  comparator: 'Comparator Intelligence',
  formulary: 'Peer Formulary'
};

const BrowserStreams = ({ streamingUrls, onClose }) => {
  const [expandedStream, setExpandedStream] = useState(null);

  if (!streamingUrls || Object.keys(streamingUrls).length === 0) {
    return null;
  }

  const activeStreams = Object.entries(streamingUrls).filter(([_, url]) => url);

  if (activeStreams.length === 0) {
    return null;
  }

  return (
    <motion.div
      className="browser-streams-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="streams-container">
        <div className="streams-header-bar">
          <div className="streams-title">
            <div className="live-indicator">
              <span className="live-dot-pulse"></span>
              <span>LIVE</span>
            </div>
            <h3>Browser Automation Streams</h3>
            <span className="stream-count-badge">{activeStreams.length} Active</span>
          </div>
          {onClose && (
            <button className="close-streams" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>

        <div className={`streams-grid ${expandedStream ? 'expanded' : ''}`}>
          {activeStreams.map(([agentId, streamUrl]) => {
            const Icon = AGENT_ICONS[agentId];
            const name = AGENT_NAMES[agentId];
            const isExpanded = expandedStream === agentId;

            return (
              <motion.div
                key={agentId}
                className={`stream-card ${isExpanded ? 'expanded' : ''}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="stream-card-header">
                  <div className="stream-info">
                    <Icon size={16} />
                    <span>{name}</span>
                  </div>
                  <div className="stream-actions">
                    <div className="live-badge">
                      <span className="live-dot"></span>
                      LIVE
                    </div>
                    <button
                      className="expand-button"
                      onClick={() => setExpandedStream(isExpanded ? null : agentId)}
                      title={isExpanded ? 'Minimize' : 'Maximize'}
                    >
                      {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                    </button>
                  </div>
                </div>
                <div className="stream-video-wrapper">
                  <iframe
                    src={streamUrl}
                    title={`${name} browser stream`}
                    frameBorder="0"
                    allow="autoplay"
                    className="stream-video-iframe"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default BrowserStreams;
