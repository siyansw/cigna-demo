import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Zap,
  Database,
  Bot,
  Clock,
  CheckCircle,
  RefreshCw,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Info
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { drugData, drugList, therapeuticClass } from '../data/drugs';
import AgentPanel from './AgentPanel';
import './Dashboard.css';

const Dashboard = ({ onNavigate, onBack }) => {
  const [showAgentPanel, setShowAgentPanel] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [newsHeadlines, setNewsHeadlines] = useState([
    { headline: 'FDA approves new GLP-1 indication for chronic weight management', time: '3 hours ago', type: 'info' },
    { headline: 'ADA updates guidelines to recommend GLP-1s for CV risk reduction', time: '6 hours ago', type: 'info' },
    { headline: 'Medicare coverage expansion for GLP-1 medications announced', time: '1 day ago', type: 'warning' }
  ]);
  const [newsIsLive, setNewsIsLive] = useState(false);

  const handleNewsUpdate = (newsData) => {
    console.log('📰 Dashboard received news update:', newsData);

    if (!newsData) return;

    // Handle different possible data structures from TinyFish API
    let newsArray = [];

    if (Array.isArray(newsData)) {
      // Data is directly an array
      newsArray = newsData;
    } else if (newsData.data && Array.isArray(newsData.data)) {
      // Data has data property (TinyFish format with count/status)
      newsArray = newsData.data;
    } else if (newsData.news_articles && Array.isArray(newsData.news_articles)) {
      // Data has news_articles property
      newsArray = newsData.news_articles;
    } else if (newsData.headlines && Array.isArray(newsData.headlines)) {
      // Data has headlines property
      newsArray = newsData.headlines;
    } else if (newsData.results && Array.isArray(newsData.results)) {
      // Data has results property
      newsArray = newsData.results;
    } else if (newsData.news && Array.isArray(newsData.news)) {
      // Data has news property
      newsArray = newsData.news;
    } else {
      console.warn('⚠️ Unexpected news data structure:', newsData);
      return;
    }

    if (newsArray.length > 0) {
      const formattedNews = newsArray.slice(0, 5).map(item => ({
        headline: item.headline || item.title || item.brief_summary || item['brief summary'] || item.summary || 'News update',
        time: item.date || item.time || item.timestamp || 'Recent',
        type: (item.headline || item.title || '')?.toLowerCase().includes('fda') ? 'info' : 'warning',
        source: item.source || item.publisher || 'TinyFish Agent'
      }));

      console.log('✓ Formatted news headlines:', formattedNews);
      setNewsHeadlines(formattedNews);
      setNewsIsLive(true);
    }
  };

  // Prepare scatter plot data
  const scatterData = drugList.map(id => {
    const drug = drugData[id];
    return {
      id,
      name: drug.name,
      x: Math.abs(drug.efficacy.hba1cReduction),
      y: Math.abs(drug.efficacy.weightLoss),
      cvBenefit: drug.efficacy.cvBenefit || 0,
      brandName: drug.brandNames[0]
    };
  });

  const getColor = (cvBenefit) => {
    if (cvBenefit >= 20) return '#00d4aa';
    if (cvBenefit > 0) return '#fbbf24';
    return '#64748b';
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="chart-tooltip">
          <p className="tooltip-title">{data.name} ({data.brandName})</p>
          <p>HbA1c: -{data.x}%</p>
          <p>Weight: -{data.y} kg</p>
          <p>CV Benefit: {data.cvBenefit ? `${data.cvBenefit}% MACE reduction` : 'No proven benefit'}</p>
        </div>
      );
    }
    return null;
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
          <span className="header-title">P&T Committee Dashboard</span>
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
            <Bot size={16} />
            {showAgentPanel ? 'Hide' : 'Show'} Agents
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-layout">
        <main className="dashboard-main">
          {/* Class Header */}
          <div className="class-header">
            <div className="class-info">
              <span className="class-indication">Type 2 Diabetes</span>
              <h1 className="class-name">GLP-1 Receptor Agonists</h1>
            </div>
            <div className="class-stats">
              <div className="stat-item">
                <Database size={16} />
                <span className="stat-value">{therapeuticClass.dataSources}</span>
                <span className="stat-label">Data Sources</span>
              </div>
              <div className="stat-item">
                <Bot size={16} />
                <span className="stat-value">6</span>
                <span className="stat-label">Agents Active</span>
              </div>
              <div className="stat-item">
                <CheckCircle size={16} className="text-green" />
                <span className="stat-value">Complete</span>
                <span className="stat-label">Status</span>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="dashboard-card">
            <div className="card-header-row">
              <h2 className="card-title">Class Comparison</h2>
              <span className="card-subtitle">Click any drug for detailed profile</span>
            </div>

            <div className="table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Drug</th>
                    <th>HbA1c Reduction</th>
                    <th>Weight Loss</th>
                    <th>CV Benefit</th>
                    <th>Dosing</th>
                    <th>FDA Approval</th>
                    <th>Guideline Rec</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {drugList.map(id => {
                    const drug = drugData[id];
                    return (
                      <tr
                        key={id}
                        className="table-row-clickable"
                        onClick={() => onNavigate('drug-detail', id)}
                      >
                        <td>
                          <div className="drug-name-cell">
                            <span className="drug-name">{drug.name}</span>
                            <span className="drug-brand">({drug.brandNames[0]})</span>
                          </div>
                        </td>
                        <td>
                          <span className="efficacy-value text-cyan">{drug.efficacy.hba1cReduction}%</span>
                        </td>
                        <td>
                          <span className="efficacy-value">{drug.efficacy.weightLoss} kg</span>
                        </td>
                        <td>
                          <CVBenefitBadge benefit={drug.efficacy.cvBenefit} text={drug.efficacy.cvBenefitText} />
                        </td>
                        <td>{drug.dosing}</td>
                        <td>{drug.approvalYear}</td>
                        <td>
                          <GuidelineBadge rec={drug.efficacy.guidelineRec} />
                        </td>
                        <td>
                          <ChevronRight size={16} className="row-arrow" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            {/* Efficacy Scatter Plot */}
            <div className="dashboard-card chart-card">
              <h3 className="card-title">Efficacy Comparison</h3>
              <p className="card-subtitle">HbA1c reduction vs Weight loss (bubble size = CV benefit)</p>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                      type="number"
                      dataKey="x"
                      name="HbA1c Reduction"
                      domain={[0.5, 2.5]}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      label={{ value: 'HbA1c Reduction (%)', position: 'bottom', fill: '#64748b', fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="y"
                      name="Weight Loss"
                      domain={[0, 10]}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                      label={{ value: 'Weight Loss (kg)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Scatter name="Drugs" data={scatterData}>
                      {scatterData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={getColor(entry.cvBenefit)}
                          r={Math.max(8, entry.cvBenefit / 2)}
                          style={{ cursor: 'pointer' }}
                          onClick={() => onNavigate('drug-detail', entry.id)}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#00d4aa' }}></span>
                  <span>Significant CV benefit (≥20%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#fbbf24' }}></span>
                  <span>Modest CV benefit</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#64748b' }}></span>
                  <span>No proven CV benefit</span>
                </div>
              </div>
            </div>

            {/* Safety Heatmap */}
            <div className="dashboard-card chart-card">
              <h3 className="card-title">Safety Profile Comparison</h3>
              <p className="card-subtitle">Common adverse event rates (%)</p>

              <div className="heatmap-container">
                <SafetyHeatmap />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="dashboard-card">
            <h3 className="card-title">FDA Approval Timeline</h3>
            <div className="timeline">
              {drugList
                .map(id => drugData[id])
                .sort((a, b) => a.approvalYear - b.approvalYear)
                .map((drug, index) => (
                  <div
                    key={drug.id}
                    className="timeline-item"
                    onClick={() => onNavigate('drug-detail', drug.id)}
                  >
                    <div className="timeline-year">{drug.approvalYear}</div>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <span className="timeline-drug">{drug.name}</span>
                      <span className="timeline-brand">{drug.brandNames[0]}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Clinical News Intelligence */}
          <div className="dashboard-card alert-card">
            <div className="card-header-row">
              <h2 className="card-title">
                <AlertTriangle size={18} className="text-cyan" />
                GLP-1 Clinical & Regulatory News
                {newsIsLive ? (
                  <span className="live-badge-inline">🔴 Live from TinyFish</span>
                ) : (
                  <span className="demo-badge-inline">Demo Data</span>
                )}
              </h2>
              <span className="card-subtitle">
                {newsIsLive ? 'Latest updates gathered by News Intelligence Agent' : 'Click "Run Agents" to fetch live news'}
              </span>
            </div>
            <div className="alerts-list">
              {newsHeadlines.map((news, idx) => (
                <div key={idx} className="alert-item">
                  <div className={`alert-dot ${news.type}`}></div>
                  <div className="alert-content">
                    <span className="alert-text">{news.headline}</span>
                    <div className="alert-meta">
                      <span className="alert-time">{news.time}</span>
                      {news.source && <span className="alert-source"> • {news.source}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Agent Panel */}
        {showAgentPanel && (
          <AgentPanel
            onRefresh={() => setLastUpdated(new Date())}
            onNewsUpdate={handleNewsUpdate}
          />
        )}
      </div>
    </motion.div>
  );
};

const CVBenefitBadge = ({ benefit, text }) => {
  if (benefit >= 20) {
    return (
      <span className="cv-badge cv-significant">
        <TrendingDown size={14} />
        {text}
      </span>
    );
  }
  if (benefit > 0) {
    return (
      <span className="cv-badge cv-modest">
        <TrendingDown size={14} />
        {text}
      </span>
    );
  }
  return (
    <span className="cv-badge cv-none">
      <Minus size={14} />
      {text}
    </span>
  );
};

const GuidelineBadge = ({ rec }) => {
  const isClassI = rec.includes('Class I');
  return (
    <span className={`guideline-badge ${isClassI ? 'class-i' : 'class-ii'}`}>
      {rec}
    </span>
  );
};

const SafetyHeatmap = () => {
  const events = ['Nausea', 'Diarrhea', 'Vomiting', 'Constipation'];
  const drugs = drugList.map(id => ({
    id,
    name: drugData[id].name,
    safety: drugData[id].safety.commonAEs
  }));

  const getHeatColor = (rate) => {
    if (rate >= 20) return 'rgba(239, 68, 68, 0.6)';
    if (rate >= 15) return 'rgba(251, 191, 36, 0.5)';
    if (rate >= 10) return 'rgba(251, 191, 36, 0.3)';
    return 'rgba(34, 197, 94, 0.2)';
  };

  return (
    <div className="heatmap">
      <div className="heatmap-header">
        <div className="heatmap-corner"></div>
        {events.map(event => (
          <div key={event} className="heatmap-col-header">{event}</div>
        ))}
      </div>
      {drugs.map(drug => (
        <div key={drug.id} className="heatmap-row">
          <div className="heatmap-row-header">{drug.name}</div>
          {events.map(event => {
            const ae = drug.safety.find(a => a.event === event);
            const rate = ae ? ae.rate : 0;
            return (
              <div
                key={event}
                className="heatmap-cell"
                style={{ background: getHeatColor(rate) }}
                title={`${drug.name} - ${event}: ${rate}%`}
              >
                {rate}%
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
