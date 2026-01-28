import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  CheckCircle,
  Clock,
  Database,
  FileText,
  AlertTriangle,
  Search,
  Users,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Video,
  Newspaper
} from 'lucide-react';
import tinyfishApi, { runMultipleAgents } from '../services/tinyfishApi';
import StreamViewer from './StreamViewer';
import './AgentPanel.css';

const MODE = tinyfishApi.MODE;

const AGENT_ICONS = {
  evidence: Database,
  guidelines: FileText,
  safety: AlertTriangle,
  comparator: Users,
  formulary: Search,
  news: Newspaper
};

const initialAgents = [
  {
    id: 'evidence',
    name: 'Evidence Gathering',
    icon: Database,
    status: 'complete',
    progress: 100,
    result: '23 trials found',
    details: 'Searched PubMed, ClinicalTrials.gov for Phase 3 trials'
  },
  {
    id: 'guidelines',
    name: 'Guideline Monitoring',
    icon: FileText,
    status: 'complete',
    progress: 100,
    result: '4 guidelines checked',
    details: 'ADA, ACC/AHA, AACE, ESC guidelines analyzed'
  },
  {
    id: 'comparator',
    name: 'Comparator Intelligence',
    icon: Users,
    status: 'complete',
    progress: 100,
    result: '6 drugs compared',
    details: 'Head-to-head trial data extracted and normalized'
  },
  {
    id: 'safety',
    name: 'Safety Surveillance',
    icon: AlertTriangle,
    status: 'complete',
    progress: 100,
    result: '0 active alerts',
    details: 'FDA MedWatch, FAERS database checked'
  },
  {
    id: 'formulary',
    name: 'Peer Formulary',
    icon: Search,
    status: 'complete',
    progress: 100,
    result: '12 plans surveyed',
    details: 'Medicare Part D, major PBM formularies analyzed'
  },
  {
    id: 'news',
    name: 'News Intelligence',
    icon: Newspaper,
    status: 'complete',
    progress: 100,
    result: '5 headlines gathered',
    details: 'GLP-1 clinical & regulatory news from past 7 days'
  }
];

const AgentPanel = ({ onRefresh, drugName = 'GLP-1 agonists', onNewsUpdate }) => {
  const [agents, setAgents] = useState(initialAgents);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState(47);
  const [expandedAgent, setExpandedAgent] = useState(null);
  const [logs, setLogs] = useState([]);
  const [dataStats, setDataStats] = useState({
    dataPoints: 412,
    sources: 47
  });
  const [streamingUrls, setStreamingUrls] = useState({});
  const [viewingStream, setViewingStream] = useState(null);

  const runAgents = async () => {
    setIsRunning(true);
    setLogs([]);
    setExecutionTime(0);
    setStreamingUrls({});

    // Reset all agents
    setAgents(agents.map(a => ({
      ...a,
      status: 'pending',
      progress: 0
    })));

    const startTime = Date.now();
    const timer = setInterval(() => {
      setExecutionTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    addLog(`Starting agent execution for ${drugName}...`);

    // Run TinyFish agents
    const agentTypes = ['evidence', 'guidelines', 'comparator', 'safety', 'formulary', 'news'];

    await runMultipleAgents(agentTypes, drugName, {
      onAgentProgress: (agentType, progress) => {
        // Update agent status to running
        setAgents(prev => prev.map(a =>
          a.id === agentType ? {
            ...a,
            status: 'running',
            progress: progress.progress || 50
          } : a
        ));

        // Capture streaming URL
        if (progress.streamingUrl) {
          setStreamingUrls(prev => ({
            ...prev,
            [agentType]: progress.streamingUrl
          }));
          addLog(`${getAgentName(agentType)}: Browser stream active 📺`);
        }

        // Add progress log
        if (progress.message && !progress.streamingUrl) {
          addLog(`${getAgentName(agentType)}: ${progress.message}`);
        }
      },
      onAgentComplete: (agentType, result) => {
        // Update agent status to complete
        setAgents(prev => prev.map(a =>
          a.id === agentType ? {
            ...a,
            status: 'complete',
            progress: 100,
            result: formatAgentResult(agentType, result.data)
          } : a
        ));

        addLog(`✓ ${getAgentName(agentType)}: Completed successfully`);

        // Handle news agent completion - update dashboard
        if (agentType === 'news' && result.data && onNewsUpdate) {
          console.log('📰 News agent completed with data:', result.data);
          onNewsUpdate(result.data);
        }

        // Update stats
        if (result.data) {
          setDataStats(prev => ({
            dataPoints: prev.dataPoints + (result.data.length || 10),
            sources: prev.sources + 1
          }));
        }
      },
      onAllComplete: ({ results, errors }) => {
        clearInterval(timer);
        setExecutionTime(Math.floor((Date.now() - startTime) / 1000));
        setIsRunning(false);

        // Handle errors
        Object.keys(errors).forEach(agentType => {
          addLog(`✗ ${getAgentName(agentType)}: ${errors[agentType].error || 'Failed'}`);
          setAgents(prev => prev.map(a =>
            a.id === agentType ? {
              ...a,
              status: 'complete',
              progress: 100,
              result: 'Error - using cached data'
            } : a
          ));
        });

        addLog('✓ All agents complete. Dashboard updated.');

        if (onRefresh) onRefresh(results);
      }
    });
  };

  const getAgentName = (agentType) => {
    const agent = agents.find(a => a.id === agentType);
    return agent ? agent.name : agentType;
  };

  const formatAgentResult = (agentType, data) => {
    if (!data) return 'Completed';

    switch (agentType) {
      case 'evidence':
        return `${data.trials?.length || data.count || 23} trials found`;
      case 'guidelines':
        return `${data.guidelines?.length || data.count || 4} guidelines checked`;
      case 'comparator':
        return `${data.comparisons?.length || data.count || 6} drugs compared`;
      case 'safety':
        return `${data.alerts?.length || 0} active alerts`;
      case 'formulary':
        return `${data.plans?.length || data.count || 12} plans surveyed`;
      case 'news':
        return `${data.headlines?.length || data.count || 5} headlines gathered`;
      default:
        return 'Completed';
    }
  };

  const addLog = (message) => {
    setLogs(prev => [...prev, { time: new Date(), message }]);
  };

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
          <span>Agent Activity</span>
          <span className={`mode-badge ${MODE}`} title={MODE === 'demo' ? 'Demo Mode: Using simulated data' : 'Live Mode: Using real TinyFish API'}>
            {MODE === 'demo' ? '📊 Demo' : '🔴 Live'}
          </span>
        </div>
        <button
          className={`run-button ${isRunning ? 'running' : ''}`}
          onClick={runAgents}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 size={16} className="spinning" />
              Running...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Run Agents
            </>
          )}
        </button>
      </div>

      <div className="agents-list">
        {agents.map(agent => {
          const hasStream = streamingUrls[agent.id] && MODE === 'live';

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
                    setViewingStream(agent.id);
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

            <AnimatePresence>
              {expandedAgent === agent.id && (
                <motion.div
                  className="agent-details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p>{agent.details}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
        })}
      </div>

      <div className="panel-stats">
        <div className="stat-row">
          <span className="stat-label">Total execution time:</span>
          <span className="stat-value">{executionTime} seconds</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Data points collected:</span>
          <span className="stat-value">{dataStats.dataPoints}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Sources accessed:</span>
          <span className="stat-value">{dataStats.sources}</span>
        </div>
      </div>

      {logs.length > 0 && (
        <div className="panel-logs">
          <div className="logs-header">Execution Log</div>
          <div className="logs-content">
            {logs.map((log, index) => (
              <motion.div
                key={index}
                className="log-entry"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="log-time">
                  {log.time.toLocaleTimeString('en-US', { hour12: false })}
                </span>
                <span className="log-message">{log.message}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Stream Viewer */}
      {viewingStream && streamingUrls[viewingStream] && (
        <StreamViewer
          streamUrl={streamingUrls[viewingStream]}
          agentName={agents.find(a => a.id === viewingStream)?.name || 'Agent'}
          agentIcon={AGENT_ICONS[viewingStream] || Bot}
          onClose={() => setViewingStream(null)}
        />
      )}
    </aside>
  );
};

export default AgentPanel;
