import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, RefreshCw, CheckCircle, FileText, Beaker, BookOpen, Shield } from 'lucide-react';
import { runMultipleAgents } from '../services/minoApi';
import NewsFeed from './NewsFeed';
import WatchLiveModal from './WatchLiveModal';
import './PTDashboard.css';

const PTDashboard = ({ onBack }) => {
  const [drugName] = useState('Semaglutide');
  const [isRunning, setIsRunning] = useState(false);
  const [showWatchLive, setShowWatchLive] = useState(false);
  const [watchLiveModalOpen, setWatchLiveModalOpen] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [agentLogs, setAgentLogs] = useState([]);
  const [agentProgress, setAgentProgress] = useState({});

  // Demo data for Semaglutide
  const demoReviewData = {
    fda: {
      approval_dates: [
        { indication: 'Type 2 Diabetes', date: '2017-12-05' },
        { indication: 'Weight Management', date: '2021-06-04' },
        { indication: 'Cardiovascular Risk Reduction', date: '2020-01-24' }
      ],
      approval_type: 'Standard',
      label_url: 'https://www.accessdata.fda.gov/drugsatfda_docs/label/2021/209637s019lbl.pdf'
    },
    clinicalTrials: {
      trials: [
        { name: 'SUSTAIN-6', phase: '3', enrollment: 3297, outcome: 'MACE reduction 26%' },
        { name: 'PIONEER-6', phase: '3', enrollment: 3183, outcome: 'CV safety demonstrated' },
        { name: 'STEP-1', phase: '3', enrollment: 1961, outcome: 'Weight loss 14.9%' }
      ]
    },
    pubmed: {
      publications: [
        { title: 'Cardiovascular Outcomes with Semaglutide in Type 2 Diabetes', journal: 'NEJM', year: 2016, pmid: '27633186' },
        { title: 'Once-Weekly Semaglutide in Adults with Overweight or Obesity', journal: 'NEJM', year: 2021, pmid: '33567185' },
        { title: 'Effect of Semaglutide on Heart Failure Outcomes', journal: 'Circulation', year: 2023, pmid: '37823286' }
      ]
    },
    guidelines: {
      organization: 'ADA',
      year: 2024,
      recommendation_class: 'I',
      evidence_level: 'A',
      text: 'Preferred GLP-1 agonist for patients with established ASCVD or high cardiovascular risk'
    }
  };

  // Load previous data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('pt-clinical-intelligence-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setReviewData(parsed.reviewData);
      setTimestamp(parsed.timestamp);
    }
  }, []);

  const handleRunReview = async () => {
    console.log('🚀 Starting PT Clinical Review...');
    setIsRunning(true);
    setShowWatchLive(true);
    setAgentLogs([]);
    setAgentProgress({});

    const startTime = Date.now();

    // Prepare agent configurations
    const agentConfigs = [
      { agentType: 'fda', params: { drugName } },
      { agentType: 'clinicalTrials', params: { drugName } },
      { agentType: 'pubmed', params: { drugName } }
    ];

    console.log('📋 Agent configs:', agentConfigs);

    // Run all agents in parallel
    await runMultipleAgents(agentConfigs, {
      onAgentProgress: (agentType, progress) => {
        console.log(`📊 ${agentType} progress:`, progress.message);

        setAgentProgress(prev => ({
          ...prev,
          [agentType]: progress
        }));

        setAgentLogs(prev => [...prev, {
          agent: agentType,
          message: progress.message,
          status: progress.status,
          time: ((Date.now() - startTime) / 1000).toFixed(1) + 's'
        }]);
      },
      onAgentComplete: (agentType, result) => {
        console.log(`✅ ${agentType} completed with data:`, result.data);
      },
      onAllComplete: ({ results: allResults, errors }) => {
        const executionTime = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`🏁 All agents complete in ${executionTime}s`);
        console.log('📦 Results:', allResults);
        console.log('❌ Errors:', errors);

        // Merge results with demo guideline data
        const finalData = {
          ...demoReviewData,
          ...allResults
        };

        console.log('💾 Final data to display:', finalData);

        setReviewData(finalData);
        setIsRunning(false);
        setTimestamp(new Date().toISOString());

        // Save to localStorage
        localStorage.setItem('pt-clinical-intelligence-data', JSON.stringify({
          reviewData: finalData,
          timestamp: new Date().toISOString()
        }));
      }
    });
  };

  const handleRefresh = () => {
    handleRunReview();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
    <div className="pt-dashboard">
      {/* Header */}
      <div className="pt-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Menu
        </button>
      </div>

      {/* Hero Section */}
      <motion.div
        className="pt-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="pt-title">
          Cigna P&T Clinical Intelligence
        </h1>
        <div className="drug-info">
          <div className="drug-name-section">
            <span className="drug-label">Drug:</span>
            <span className="drug-name">{drugName}</span>
            <span className="drug-brand">(Ozempic / Wegovy)</span>
          </div>
          <div className="drug-meta">
            <span className="drug-manufacturer">Novo Nordisk</span>
            <span className="drug-dot">•</span>
            <span className="drug-class">GLP-1 Receptor Agonist</span>
          </div>
        </div>

        <div className="pt-actions">
          <button
            className={`run-button ${isRunning ? 'running' : ''}`}
            onClick={handleRunReview}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <Clock size={20} className="animate-pulse" />
                Running Clinical Review...
              </>
            ) : (
              <>
                <Play size={20} />
                Run Clinical Review
              </>
            )}
          </button>

          {showWatchLive && (
            <motion.button
              className="watch-live-button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => setWatchLiveModalOpen(true)}
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
          <p className="pt-timestamp">
            Last updated: {formatTimestamp(timestamp)}
          </p>
        )}
      </motion.div>

      {/* Review Data Cards */}
      {reviewData ? (
        <div className="review-cards">
          {/* FDA Card */}
          <motion.div
            className="review-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="review-card-header">
              <FileText size={24} className="card-icon" />
              <div>
                <h3 className="card-title">FDA Approval Data</h3>
                <p className="card-subtitle">Drugs@FDA Database</p>
              </div>
            </div>
            <div className="review-card-body">
              <div className="approval-list">
                {reviewData.fda.approval_dates.map((approval, index) => (
                  <div key={index} className="approval-item">
                    <CheckCircle size={16} className="text-green" />
                    <div className="approval-content">
                      <div className="approval-indication">{approval.indication}</div>
                      <div className="approval-date">{formatDate(approval.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="approval-type">
                <span className="label">Approval Type:</span>
                <span className="approval-type-badge">{reviewData.fda.approval_type}</span>
              </div>
            </div>
          </motion.div>

          {/* Clinical Trials Card */}
          <motion.div
            className="review-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="review-card-header">
              <Beaker size={24} className="card-icon" />
              <div>
                <h3 className="card-title">Clinical Trials</h3>
                <p className="card-subtitle">ClinicalTrials.gov</p>
              </div>
            </div>
            <div className="review-card-body">
              {reviewData.clinicalTrials.trials.map((trial, index) => (
                <div key={index} className="trial-item">
                  <div className="trial-header">
                    <span className="trial-name">{trial.name}</span>
                    <span className="trial-phase">Phase {trial.phase}</span>
                  </div>
                  <div className="trial-details">
                    <span className="trial-enrollment">n={trial.enrollment.toLocaleString()}</span>
                    <span className="trial-outcome">{trial.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* PubMed Card */}
          <motion.div
            className="review-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="review-card-header">
              <BookOpen size={24} className="card-icon" />
              <div>
                <h3 className="card-title">Key Publications</h3>
                <p className="card-subtitle">PubMed / NCBI</p>
              </div>
            </div>
            <div className="review-card-body">
              {reviewData.pubmed.publications.map((pub, index) => (
                <div key={index} className="publication-item">
                  <div className="pub-title">{pub.title}</div>
                  <div className="pub-meta">
                    <span className="pub-journal">{pub.journal}</span>
                    <span className="pub-dot">•</span>
                    <span className="pub-year">{pub.year}</span>
                    <span className="pub-dot">•</span>
                    <span className="pub-pmid">PMID: {pub.pmid}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Guidelines Card */}
          <motion.div
            className="review-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="review-card-header">
              <Shield size={24} className="card-icon" />
              <div>
                <h3 className="card-title">Clinical Guidelines</h3>
                <p className="card-subtitle">{reviewData.guidelines.organization} Standards of Care</p>
              </div>
            </div>
            <div className="review-card-body">
              <div className="guideline-badges">
                <div className="guideline-badge">
                  <span className="badge-label">Recommendation</span>
                  <span className="badge-value class-i">Class {reviewData.guidelines.recommendation_class}</span>
                </div>
                <div className="guideline-badge">
                  <span className="badge-label">Evidence Level</span>
                  <span className="badge-value level-a">Level {reviewData.guidelines.evidence_level}</span>
                </div>
                <div className="guideline-badge">
                  <span className="badge-label">Year</span>
                  <span className="badge-value">{reviewData.guidelines.year}</span>
                </div>
              </div>
              <div className="guideline-text">
                {reviewData.guidelines.text}
              </div>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="review-placeholder">
          <p>Click "Run Clinical Review" to gather comprehensive drug intelligence</p>
        </div>
      )}

      {/* News Feed */}
      <NewsFeed type="pt" />

      {/* Watch Live Modal */}
      <WatchLiveModal
        isOpen={watchLiveModalOpen}
        onClose={() => setWatchLiveModalOpen(false)}
        agents={Object.entries(agentProgress).map(([type, progress]) => ({
          name: type.replace(/([A-Z])/g, ' $1').trim(),
          status: progress.status || 'pending',
          logs: agentLogs.filter(log => log.agent === type).map(log => ({
            message: log.message,
            status: log.status,
            time: log.time
          })),
          result: progress.data
        }))}
        logs={agentLogs}
      />
    </div>
  );
};

export default PTDashboard;
