import { motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  FileText,
  AlertTriangle,
  Zap,
  Database,
  Bot,
  CheckCircle,
  Play,
  ArrowRight
} from 'lucide-react';
import './Presentation.css';

const slides = [
  {
    id: 'problem',
    title: 'P&T Committee Evidence Gathering Is',
    titleAccent: 'Manual and Slow',
    content: 'problem'
  },
  {
    id: 'solution',
    title: 'Automated Clinical Intelligence in',
    titleAccent: '48 Hours',
    content: 'solution'
  },
  {
    id: 'demo',
    title: 'See It in Action:',
    titleAccent: 'GLP-1 Agonist Class Review',
    content: 'demo'
  }
];

const Presentation = ({ currentSlide, setCurrentSlide, onNavigate }) => {
  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <motion.div
      className="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="presentation-header">
        <div className="header-left">
          <div className="header-logo">
            <div className="logo-icon">
              <Zap size={14} />
            </div>
            <span>TinyFish</span>
          </div>
          <span className="header-divider">|</span>
          <span className="header-title">Optum Rx P&T Committee</span>
        </div>
        <div className="header-right">
          <span className="slide-indicator">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="presentation-content">
        <motion.div
          key={slide.id}
          className="slide"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="slide-title">
            {slide.title} <span className="text-cyan">{slide.titleAccent}</span>
          </h1>

          {slide.content === 'problem' && <ProblemSlide />}
          {slide.content === 'solution' && <SolutionSlide />}
          {slide.content === 'demo' && <DemoSlide onNavigate={onNavigate} />}
        </motion.div>
      </main>

      {/* Navigation */}
      <footer className="presentation-footer">
        <button
          className="nav-button"
          onClick={goPrev}
          disabled={currentSlide === 0}
        >
          <ChevronLeft size={20} />
        </button>

        <div className="slide-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''} ${index < currentSlide ? 'completed' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <button
          className="nav-button"
          onClick={goNext}
          disabled={currentSlide === slides.length - 1}
        >
          <ChevronRight size={20} />
        </button>
      </footer>
    </motion.div>
  );
};

const ProblemSlide = () => (
  <div className="slide-content problem-slide">
    <div className="problem-grid">
      {/* Left side - Current State */}
      <div className="problem-card current-state">
        <div className="card-header">
          <Clock className="card-icon text-orange" size={24} />
          <h3>Current State</h3>
        </div>
        <div className="problem-visual">
          <div className="visual-item">
            <Search size={20} />
            <span>Manual PubMed searches</span>
          </div>
          <div className="visual-item">
            <FileText size={20} />
            <span>Multiple browser tabs</span>
          </div>
          <div className="visual-item">
            <AlertTriangle size={20} />
            <span>Risk of missing data</span>
          </div>
        </div>
        <div className="time-indicator">
          <span className="time-value text-orange">5 Days</span>
          <span className="time-label">from request to committee-ready packet</span>
        </div>
      </div>

      {/* Right side - Pain Points */}
      <div className="problem-card pain-points">
        <div className="card-header">
          <AlertTriangle className="card-icon text-red" size={24} />
          <h3>The Challenge</h3>
        </div>
        <ul className="pain-list">
          <li>
            <span className="pain-number">10-15</span>
            <span className="pain-text">drugs reviewed per monthly P&T meeting</span>
          </li>
          <li>
            <span className="pain-number">Days</span>
            <span className="pain-text">spent searching PubMed, FDA databases, clinical guidelines</span>
          </li>
          <li>
            <span className="pain-icon"><AlertTriangle size={16} /></span>
            <span className="pain-text">Risk of missing critical safety alerts or new trial data</span>
          </li>
          <li>
            <span className="pain-icon"><Clock size={16} /></span>
            <span className="pain-text">Committee decisions delayed by incomplete evidence</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const SolutionSlide = () => (
  <div className="slide-content solution-slide">
    {/* Architecture Diagram */}
    <div className="architecture">
      <div className="arch-input">
        <div className="arch-box">
          <FileText size={24} />
          <span>Drug Name + Indication</span>
        </div>
      </div>

      <div className="arch-arrow">
        <ArrowRight size={24} />
      </div>

      <div className="arch-agents">
        <div className="agents-label">TinyFish Agents</div>
        <div className="agent-icons">
          <div className="agent-icon" data-label="Trials">
            <Database size={18} />
          </div>
          <div className="agent-icon" data-label="Guidelines">
            <FileText size={18} />
          </div>
          <div className="agent-icon" data-label="Safety">
            <AlertTriangle size={18} />
          </div>
          <div className="agent-icon" data-label="Formulary">
            <Search size={18} />
          </div>
          <div className="agent-icon" data-label="Compare">
            <Bot size={18} />
          </div>
        </div>
      </div>

      <div className="arch-arrow">
        <ArrowRight size={24} />
      </div>

      <div className="arch-output">
        <div className="arch-box output-box">
          <CheckCircle size={24} />
          <span>Structured Dashboard</span>
        </div>
      </div>
    </div>

    {/* Benefits */}
    <div className="solution-benefits">
      <div className="benefit-card">
        <div className="benefit-icon">
          <Database size={20} />
        </div>
        <h4>15+ Sources</h4>
        <p>Phase 3 trials, FDA labels, clinical guidelines, safety alerts, peer formularies</p>
      </div>
      <div className="benefit-card">
        <div className="benefit-icon">
          <Zap size={20} />
        </div>
        <h4>Structured Data</h4>
        <p>Evidence formatted and ready for committee review</p>
      </div>
      <div className="benefit-card">
        <div className="benefit-icon">
          <Bot size={20} />
        </div>
        <h4>Continuous Monitoring</h4>
        <p>Automatic updates for new trials, safety alerts, guideline changes</p>
      </div>
    </div>
  </div>
);

const DemoSlide = ({ onNavigate }) => (
  <div className="slide-content demo-slide">
    <p className="demo-description">
      Experience how TinyFish agents gather comprehensive clinical evidence for the entire GLP-1 agonist drug class in real-time.
    </p>

    <div className="demo-preview">
      <div className="preview-stats">
        <div className="stat">
          <span className="stat-value text-cyan">6</span>
          <span className="stat-label">Drugs Analyzed</span>
        </div>
        <div className="stat">
          <span className="stat-value text-cyan">47</span>
          <span className="stat-label">Data Sources</span>
        </div>
        <div className="stat">
          <span className="stat-value text-cyan">5</span>
          <span className="stat-label">Active Agents</span>
        </div>
      </div>

      <div className="demo-features">
        <div className="feature">
          <CheckCircle size={16} className="text-green" />
          <span>Class comparison with efficacy scatter plots</span>
        </div>
        <div className="feature">
          <CheckCircle size={16} className="text-green" />
          <span>Individual drug profiles with 6 evidence tabs</span>
        </div>
        <div className="feature">
          <CheckCircle size={16} className="text-green" />
          <span>Live agent execution demonstration</span>
        </div>
        <div className="feature">
          <CheckCircle size={16} className="text-green" />
          <span>Source citations for every data point</span>
        </div>
      </div>
    </div>

    <button
      className="demo-button"
      onClick={() => onNavigate('dashboard')}
    >
      <Play size={20} />
      Launch Interactive Dashboard
    </button>
  </div>
);

export default Presentation;
