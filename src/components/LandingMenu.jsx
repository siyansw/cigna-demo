import { motion } from 'framer-motion';
import { UserCheck, Pill, ArrowRight } from 'lucide-react';
import './LandingMenu.css';

const LandingMenu = ({ onNavigate }) => {
  return (
    <div className="landing-menu">
      <motion.div
        className="landing-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="landing-header">
          <h1 className="landing-title">
            Healthcare <span className="text-cyan">× TinyFish</span>
          </h1>
          <p className="landing-subtitle">
            Clinical Intelligence Platform
          </p>
          <p className="landing-description">
            AI-powered automation for healthcare workflows
          </p>
        </div>

        <div className="landing-cards">
          <motion.div
            className="landing-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => onNavigate('credential-verification')}
          >
            <div className="landing-card-icon">
              <UserCheck size={32} />
            </div>
            <h2 className="landing-card-title">Credential Verification</h2>
            <p className="landing-card-description">
              Real-time provider credential verification with automated NPI and medical license lookups
            </p>
            <ul className="landing-card-features">
              <li>NPI Registry API integration</li>
              <li>Texas Medical Board verification</li>
              <li>Live agent streaming</li>
              <li>Industry news updates</li>
            </ul>
            <div className="landing-card-footer">
              <span className="landing-card-link">
                Launch Dashboard <ArrowRight size={16} />
              </span>
            </div>
          </motion.div>

          <motion.div
            className="landing-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => onNavigate('pt-intelligence')}
          >
            <div className="landing-card-icon">
              <Pill size={32} />
            </div>
            <h2 className="landing-card-title">P&T Clinical Intelligence</h2>
            <p className="landing-card-description">
              Automated clinical evidence gathering for pharmacy & therapeutics formulary decisions
            </p>
            <ul className="landing-card-features">
              <li>FDA Drugs@FDA extraction</li>
              <li>ClinicalTrials.gov search</li>
              <li>PubMed literature review</li>
              <li>Guideline integration</li>
            </ul>
            <div className="landing-card-footer">
              <span className="landing-card-link">
                Launch Dashboard <ArrowRight size={16} />
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="landing-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="landing-footer-text">
            Powered by TinyFish AI Web Automation
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingMenu;
