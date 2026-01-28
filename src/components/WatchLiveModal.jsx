import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import './WatchLiveModal.css';

const WatchLiveModal = ({ isOpen, onClose, agents, logs }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const logsContainerRef = useRef(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '⏳';
      case 'error':
        return '✗';
      default:
        return '○';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'status-completed';
      case 'in_progress':
        return 'status-in-progress';
      case 'error':
        return 'status-error';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="watch-live-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`watch-live-modal ${isFullscreen ? 'fullscreen' : ''}`}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header">
            <div className="modal-header-left">
              <span className="live-indicator-modal"></span>
              <h2 className="modal-title">Live Agent Execution</h2>
            </div>
            <div className="modal-header-actions">
              <button
                className="modal-action-btn"
                onClick={toggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button
                className="modal-action-btn"
                onClick={onClose}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body" ref={logsContainerRef}>
            {agents.map((agent, index) => (
              <div key={index} className="agent-log-section">
                <div className="agent-log-header">
                  <span className={`agent-status-icon ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                  </span>
                  <h3 className="agent-log-title">{agent.name}</h3>
                  {agent.status === 'in_progress' && (
                    <span className="agent-loading">Running...</span>
                  )}
                </div>

                <div className="agent-log-content">
                  {agent.logs && agent.logs.length > 0 ? (
                    agent.logs.map((log, logIndex) => (
                      <div key={logIndex} className="log-entry">
                        <span className={`log-icon ${getStatusColor(log.status)}`}>
                          {getStatusIcon(log.status)}
                        </span>
                        <span className="log-message">{log.message}</span>
                        {log.time && (
                          <span className="log-time">({log.time})</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="log-entry">
                      <span className="log-icon">⏳</span>
                      <span className="log-message">Initializing...</span>
                    </div>
                  )}

                  {agent.result && (
                    <div className="agent-result">
                      <div className="result-label">Result:</div>
                      <pre className="result-json">
                        {formatJSON(JSON.stringify(agent.result))}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {agents.every(a => a.status === 'completed') && (
              <div className="execution-summary">
                <div className="summary-icon">✓</div>
                <div className="summary-text">
                  All agents completed successfully
                </div>
                {agents[0]?.totalTime && (
                  <div className="summary-time">
                    Total execution time: {agents[0].totalTime}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WatchLiveModal;
