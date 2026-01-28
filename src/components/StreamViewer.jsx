import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Minimize2, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import './StreamViewer.css';

const StreamViewer = ({ streamUrl, agentName, agentIcon: Icon, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!streamUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`stream-viewer-overlay ${isFullscreen ? 'fullscreen' : ''}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="stream-viewer-container"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="stream-viewer-header">
            <div className="stream-viewer-title">
              <Icon size={18} />
              <span>{agentName}</span>
              <div className="live-indicator-viewer">
                <span className="live-dot-pulse"></span>
                <span>LIVE</span>
              </div>
            </div>
            <div className="stream-viewer-actions">
              <button
                className="viewer-action-btn"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                className="viewer-action-btn"
                onClick={() => window.open(streamUrl, '_blank')}
                title="Open in new tab"
              >
                <ExternalLink size={16} />
              </button>
              <button
                className="viewer-action-btn close-btn"
                onClick={onClose}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Video Stream */}
          <div className="stream-viewer-body">
            <iframe
              src={streamUrl}
              title={`${agentName} browser stream`}
              frameBorder="0"
              allow="autoplay"
              className="stream-viewer-iframe"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StreamViewer;
