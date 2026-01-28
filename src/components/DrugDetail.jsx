import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Zap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingDown,
  Building,
  Calendar,
  Pill,
  FileText,
  Shield,
  Scale,
  BookOpen,
  Users,
  Bell
} from 'lucide-react';
import { drugData } from '../data/drugs';
import './DrugDetail.css';

const tabs = [
  { id: 'efficacy', label: 'Efficacy', icon: TrendingDown },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'evidence', label: 'Evidence Quality', icon: Scale },
  { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
  { id: 'comparators', label: 'Comparators', icon: Users },
  { id: 'formularies', label: 'Peer Formularies', icon: Building },
  { id: 'updates', label: 'Updates & Alerts', icon: Bell }
];

const DrugDetail = ({ drugId, onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('efficacy');
  const drug = drugData[drugId];

  if (!drug) {
    return <div>Drug not found</div>;
  }

  return (
    <motion.div
      className="drug-detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <header className="detail-header">
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
          <span className="header-title">Drug Profile</span>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary" onClick={() => onNavigate('dashboard')}>
            Back to Class Overview
          </button>
        </div>
      </header>

      {/* Drug Info Banner */}
      <div className="drug-banner">
        <div className="drug-info">
          <div className="drug-main">
            <h1 className="drug-name">{drug.name}</h1>
            <div className="drug-brands">
              {drug.brandNames.map((brand, i) => (
                <span key={brand} className="brand-tag">
                  {brand}
                </span>
              ))}
            </div>
          </div>
          <div className="drug-meta">
            <div className="meta-item">
              <Building size={14} />
              <span>{drug.manufacturer}</span>
            </div>
            <div className="meta-item">
              <Calendar size={14} />
              <span>FDA Approval: {drug.fdaApproval}</span>
            </div>
            <div className="meta-item">
              <Pill size={14} />
              <span>{drug.drugClass}</span>
            </div>
          </div>
        </div>
        <div className="drug-quick-stats">
          <div className="quick-stat">
            <span className="quick-label">HbA1c Reduction</span>
            <span className="quick-value text-cyan">{drug.efficacy.hba1cReduction}%</span>
          </div>
          <div className="quick-stat">
            <span className="quick-label">Weight Loss</span>
            <span className="quick-value">{drug.efficacy.weightLoss} kg</span>
          </div>
          <div className="quick-stat">
            <span className="quick-label">CV Benefit</span>
            <span className="quick-value">{drug.efficacy.cvBenefitText}</span>
          </div>
          <div className="quick-stat">
            <span className="quick-label">Dosing</span>
            <span className="quick-value">{drug.dosing}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <nav className="tabs-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <main className="detail-content">
        {activeTab === 'efficacy' && <EfficacyTab drug={drug} />}
        {activeTab === 'safety' && <SafetyTab drug={drug} />}
        {activeTab === 'evidence' && <EvidenceTab drug={drug} />}
        {activeTab === 'guidelines' && <GuidelinesTab drug={drug} />}
        {activeTab === 'comparators' && <ComparatorsTab drug={drug} onNavigate={onNavigate} />}
        {activeTab === 'formularies' && <FormulariesTab drug={drug} />}
        {activeTab === 'updates' && <UpdatesTab drug={drug} />}
      </main>
    </motion.div>
  );
};

const EfficacyTab = ({ drug }) => {
  const [expandedTrial, setExpandedTrial] = useState(null);

  return (
    <div className="tab-content">
      {/* Efficacy Summary */}
      <div className="content-card">
        <h3 className="card-title">Efficacy Summary</h3>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">HbA1c Reduction</span>
            <span className="metric-value text-cyan">{drug.efficacy.hba1cReduction}%</span>
            <span className="metric-range">Range: {drug.efficacy.hba1cRange[0]}% to {drug.efficacy.hba1cRange[1]}%</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Weight Loss</span>
            <span className="metric-value">{drug.efficacy.weightLoss} kg</span>
            <span className="metric-range">Range: {drug.efficacy.weightLossRange[0]} kg to {drug.efficacy.weightLossRange[1]} kg</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Fasting Glucose</span>
            <span className="metric-value">{drug.efficacy.fastingGlucose} mg/dL</span>
          </div>
          {drug.efficacy.cvBenefit > 0 && (
            <div className="metric-card highlight">
              <span className="metric-label">CV Outcomes</span>
              <span className="metric-value text-cyan">{drug.efficacy.cvBenefit}% MACE reduction</span>
              <span className="metric-range">NNT: {drug.efficacy.nnt} over 2 years</span>
            </div>
          )}
        </div>
      </div>

      {/* Pivotal Trials */}
      <div className="content-card">
        <h3 className="card-title">Pivotal Trials</h3>
        <div className="trials-list">
          {drug.pivotalTrials?.map((trial, index) => (
            <div key={index} className="trial-item">
              <div
                className="trial-header"
                onClick={() => setExpandedTrial(expandedTrial === index ? null : index)}
              >
                <div className="trial-info">
                  <span className="trial-name">{trial.name}</span>
                  <span className="trial-type">{trial.type}</span>
                </div>
                <div className="trial-toggle">
                  {expandedTrial === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {expandedTrial === index && (
                <motion.div
                  className="trial-details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="detail-label">Design</span>
                      <span className="detail-value">{trial.design}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Population</span>
                      <span className="detail-value">{trial.population}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Duration</span>
                      <span className="detail-value">{trial.duration}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Primary Endpoint</span>
                      <span className="detail-value">{trial.primaryEndpoint}</span>
                    </div>
                  </div>

                  {trial.results && (
                    <div className="results-section">
                      <h4>Results</h4>
                      {trial.results.mace && (
                        <div className="result-row">
                          <span className="result-label">MACE:</span>
                          <span className="result-value">
                            {trial.results.mace.treatment}% vs {trial.results.mace.placebo}%
                            (HR {trial.results.mace.hr}, 95% CI: {trial.results.mace.ci[0]}-{trial.results.mace.ci[1]}, p={trial.results.mace.pValue})
                          </span>
                        </div>
                      )}
                      {trial.results.hba1c && (
                        <div className="result-row">
                          <span className="result-label">HbA1c:</span>
                          <span className="result-value">
                            {trial.results.hba1c.treatment}% vs {trial.results.hba1c.placebo || 'comparator'}%
                          </span>
                        </div>
                      )}
                      {trial.results.weight && (
                        <div className="result-row">
                          <span className="result-label">Weight:</span>
                          <span className="result-value">
                            {trial.results.weight.treatment} kg vs {trial.results.weight.placebo || 'comparator'} kg
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="trial-sources">
                    <a href={trial.source} target="_blank" rel="noopener noreferrer" className="source-link">
                      <ExternalLink size={14} />
                      View Publication
                    </a>
                    <span className="nct-id">ClinicalTrials.gov: {trial.nctId}</span>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SafetyTab = ({ drug }) => (
  <div className="tab-content">
    {/* Black Box Warning */}
    {drug.safety.blackBoxWarning && (
      <div className="content-card warning-card">
        <div className="warning-header">
          <AlertTriangle size={20} />
          <h3>Black Box Warning</h3>
        </div>
        <p className="warning-text">{drug.safety.blackBoxWarning}</p>
      </div>
    )}

    {/* Adverse Events */}
    <div className="content-card">
      <h3 className="card-title">Adverse Events</h3>
      <p className="card-subtitle">Discontinuation due to AEs: {drug.safety.discontinuationRate}%</p>

      <div className="ae-table">
        <div className="ae-header">
          <span>Event</span>
          <span>Treatment Rate</span>
          <span>Placebo Rate</span>
        </div>
        {drug.safety.commonAEs.map((ae, index) => (
          <div key={index} className="ae-row">
            <span className="ae-event">{ae.event}</span>
            <span className="ae-rate">{ae.rate}%</span>
            <span className="ae-placebo">{ae.placeboRate}%</span>
          </div>
        ))}
      </div>
    </div>

    {/* Serious AEs */}
    {drug.safety.seriousAEs && (
      <div className="content-card">
        <h3 className="card-title">Serious Adverse Events</h3>
        <div className="serious-ae-list">
          {drug.safety.seriousAEs.map((ae, index) => (
            <div key={index} className="serious-ae-item">
              <div className="sae-header">
                <span className="sae-event">{ae.event}</span>
                <span className="sae-rate">{ae.rate}%</span>
              </div>
              {ae.note && <span className="sae-note">{ae.note}</span>}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Warnings */}
    <div className="content-card">
      <h3 className="card-title">Warnings and Precautions</h3>
      <ul className="warnings-list">
        {drug.safety.warnings.map((warning, index) => (
          <li key={index}>
            <Info size={14} />
            <span>{warning}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const EvidenceTab = ({ drug }) => (
  <div className="tab-content">
    <div className="content-card">
      <h3 className="card-title">Clinical Program Overview</h3>
      <div className="evidence-grid">
        <div className="evidence-item">
          <span className="evidence-label">Number of trials</span>
          <span className="evidence-value">{drug.evidenceQuality.totalTrials}</span>
        </div>
        <div className="evidence-item">
          <span className="evidence-label">Trial names</span>
          <span className="evidence-value">{drug.evidenceQuality.trialNames}</span>
        </div>
        <div className="evidence-item">
          <span className="evidence-label">Total patients</span>
          <span className="evidence-value">{drug.evidenceQuality.totalPatients?.toLocaleString()}</span>
        </div>
        <div className="evidence-item">
          <span className="evidence-label">Duration range</span>
          <span className="evidence-value">{drug.evidenceQuality.durationRange}</span>
        </div>
      </div>
    </div>

    <div className="content-card">
      <h3 className="card-title">Study Design Quality</h3>
      <div className="quality-checks">
        <div className="quality-item">
          <CheckCircle size={16} className={drug.evidenceQuality.studyDesign?.rct ? 'text-green' : 'text-muted'} />
          <span>Randomized controlled trials: {drug.evidenceQuality.studyDesign?.rct}/{drug.evidenceQuality.totalTrials}</span>
        </div>
        <div className="quality-item">
          <CheckCircle size={16} className={drug.evidenceQuality.studyDesign?.doubleBlind > 0 ? 'text-green' : 'text-muted'} />
          <span>Double-blind: {drug.evidenceQuality.studyDesign?.doubleBlind}/{drug.evidenceQuality.totalTrials}</span>
        </div>
        <div className="quality-item">
          <CheckCircle size={16} className={drug.evidenceQuality.studyDesign?.activeComparator > 0 ? 'text-green' : 'text-muted'} />
          <span>Active comparator: {drug.evidenceQuality.studyDesign?.activeComparator}/{drug.evidenceQuality.totalTrials}</span>
        </div>
        <div className="quality-item">
          <CheckCircle size={16} className={drug.evidenceQuality.studyDesign?.cvot ? 'text-green' : 'text-muted'} />
          <span>Cardiovascular outcomes trial: {drug.evidenceQuality.studyDesign?.cvot ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>

    {drug.evidenceQuality.population && (
      <div className="content-card">
        <h3 className="card-title">Population Representativeness</h3>
        <div className="population-grid">
          <div className="pop-item">
            <span className="pop-label">Mean age</span>
            <span className="pop-value">{drug.evidenceQuality.population.meanAge} years</span>
          </div>
          <div className="pop-item">
            <span className="pop-label">Female</span>
            <span className="pop-value">{drug.evidenceQuality.population.female}%</span>
          </div>
          <div className="pop-item">
            <span className="pop-label">Baseline HbA1c</span>
            <span className="pop-value">{drug.evidenceQuality.population.baselineHba1c}%</span>
          </div>
          <div className="pop-item">
            <span className="pop-label">Diabetes duration</span>
            <span className="pop-value">{drug.evidenceQuality.population.diabetesDuration} years</span>
          </div>
        </div>
      </div>
    )}
  </div>
);

const GuidelinesTab = ({ drug }) => (
  <div className="tab-content">
    {drug.guidelines?.map((guideline, index) => (
      <div key={index} className="content-card guideline-card">
        <div className="guideline-header">
          <h3>{guideline.organization} ({guideline.year})</h3>
          {guideline.class && (
            <span className={`class-badge ${guideline.class === 'I' ? 'class-i' : 'class-ii'}`}>
              Class {guideline.class}, Level {guideline.evidenceLevel}
            </span>
          )}
        </div>
        <p className="guideline-rec">{guideline.recommendation}</p>
        {guideline.position && (
          <p className="guideline-position">
            <strong>Position:</strong> {guideline.position}
          </p>
        )}
        {guideline.quote && (
          <blockquote className="guideline-quote">
            "{guideline.quote}"
          </blockquote>
        )}
        <a href={guideline.source} target="_blank" rel="noopener noreferrer" className="source-link">
          <ExternalLink size={14} />
          View Source
        </a>
      </div>
    ))}
  </div>
);

const ComparatorsTab = ({ drug, onNavigate }) => (
  <div className="tab-content">
    <div className="content-card">
      <h3 className="card-title">Head-to-Head Comparison</h3>
      <p className="card-subtitle">Based on direct comparison trials and indirect evidence</p>

      <table className="comparison-detail-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th className="text-cyan">{drug.name}</th>
            <th>Dulaglutide</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HbA1c reduction</td>
            <td className="text-cyan">{drug.efficacy.hba1cReduction}%</td>
            <td>-1.4%</td>
            <td>SUSTAIN-7 / AWARD trials</td>
          </tr>
          <tr>
            <td>Weight loss</td>
            <td className="text-cyan">{drug.efficacy.weightLoss} kg</td>
            <td>-3.0 kg</td>
            <td>SUSTAIN-7</td>
          </tr>
          <tr>
            <td>MACE reduction</td>
            <td className="text-cyan">{drug.efficacy.cvBenefit || 0}%</td>
            <td>12%</td>
            <td>Respective CVOTs</td>
          </tr>
          <tr>
            <td>Dosing</td>
            <td>{drug.dosing}</td>
            <td>Weekly</td>
            <td>FDA labels</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div className="content-card">
      <h3 className="card-title">Clinical Differentiation</h3>
      <div className="differentiation-list">
        {drug.efficacy.cvBenefit > 12 && (
          <div className="diff-item positive">
            <CheckCircle size={16} />
            <span>Greater MACE reduction vs dulaglutide ({drug.efficacy.cvBenefit}% vs 12%)</span>
          </div>
        )}
        {Math.abs(drug.efficacy.hba1cReduction) > 1.4 && (
          <div className="diff-item positive">
            <CheckCircle size={16} />
            <span>Superior HbA1c reduction in head-to-head trials</span>
          </div>
        )}
        {Math.abs(drug.efficacy.weightLoss) > 3.0 && (
          <div className="diff-item positive">
            <CheckCircle size={16} />
            <span>Superior weight loss vs comparators</span>
          </div>
        )}
        <div className="diff-item neutral">
          <Info size={16} />
          <span>Similar safety profile to other GLP-1 agonists</span>
        </div>
      </div>
    </div>
  </div>
);

const FormulariesTab = ({ drug }) => (
  <div className="tab-content">
    {drug.peerFormularies?.medicarePartD && (
      <div className="content-card">
        <h3 className="card-title">Medicare Part D Coverage (2024)</h3>
        <div className="formulary-stats">
          <div className="form-stat">
            <span className="form-value text-cyan">
              {drug.peerFormularies.medicarePartD.coveragePercent}%
            </span>
            <span className="form-label">
              Plans covering ({drug.peerFormularies.medicarePartD.coveringPlans}/{drug.peerFormularies.medicarePartD.totalPlans})
            </span>
          </div>
        </div>

        <div className="tier-breakdown">
          <h4>Tier Placement</h4>
          <div className="tier-bars">
            {Object.entries(drug.peerFormularies.medicarePartD.tierPlacement).map(([tier, pct]) => (
              <div key={tier} className="tier-bar-item">
                <span className="tier-label">{tier.replace('tier', 'Tier ')}</span>
                <div className="tier-bar">
                  <div className="tier-bar-fill" style={{ width: `${pct}%` }}></div>
                </div>
                <span className="tier-pct">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {drug.peerFormularies?.majorPBMs && (
      <div className="content-card">
        <h3 className="card-title">Major PBM Status</h3>
        <div className="pbm-list">
          {drug.peerFormularies.majorPBMs.map((pbm, index) => (
            <div key={index} className="pbm-item">
              <span className="pbm-name">{pbm.name}</span>
              <span className={`pbm-status ${pbm.status.toLowerCase().replace(' ', '-')}`}>
                {pbm.status}
              </span>
              {pbm.tier && <span className="pbm-tier">Tier {pbm.tier}</span>}
              {pbm.note && <span className="pbm-note">{pbm.note}</span>}
            </div>
          ))}
        </div>
      </div>
    )}

    {drug.peerFormularies?.vaFormulary && (
      <div className="content-card">
        <h3 className="card-title">VA National Formulary</h3>
        <div className="va-info">
          <div className="va-status">
            <span className="va-label">Status:</span>
            <span className="va-value">{drug.peerFormularies.vaFormulary.status}</span>
          </div>
          {drug.peerFormularies.vaFormulary.criteria && (
            <div className="va-criteria">
              <span className="va-label">Criteria:</span>
              <span className="va-value">{drug.peerFormularies.vaFormulary.criteria}</span>
            </div>
          )}
        </div>
      </div>
    )}

    {drug.peerFormularies?.stateMedicaid && (
      <div className="content-card">
        <h3 className="card-title">State Medicaid</h3>
        <div className="medicaid-grid">
          {drug.peerFormularies.stateMedicaid.map((state, index) => (
            <div key={index} className="medicaid-item">
              <span className="state-name">{state.state}</span>
              <span className={`state-status ${state.status.toLowerCase().includes('preferred') ? 'preferred' : 'non-preferred'}`}>
                {state.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

const UpdatesTab = ({ drug }) => (
  <div className="tab-content">
    {drug.updates?.activeSafetyAlerts?.length > 0 ? (
      <div className="content-card alert-card">
        <div className="alert-header">
          <AlertTriangle size={20} />
          <h3>Active Safety Alerts</h3>
        </div>
        {drug.updates.activeSafetyAlerts.map((alert, index) => (
          <p key={index} className="alert-text">{alert}</p>
        ))}
      </div>
    ) : (
      <div className="content-card success-card">
        <div className="success-header">
          <CheckCircle size={20} />
          <h3>No Active Safety Alerts</h3>
        </div>
        <p className="success-text">No FDA MedWatch alerts or safety communications in the past 12 months.</p>
      </div>
    )}

    {drug.updates?.newIndications && (
      <div className="content-card">
        <h3 className="card-title">New Indications</h3>
        <ul className="updates-list">
          {drug.updates.newIndications.map((item, index) => (
            <li key={index}>
              <CheckCircle size={14} className="text-green" />
              <span>{item.indication}</span>
              <span className="update-date">{item.date}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {drug.updates?.guidelineChanges && (
      <div className="content-card">
        <h3 className="card-title">Guideline Changes</h3>
        <ul className="updates-list">
          {drug.updates.guidelineChanges.map((item, index) => (
            <li key={index}>
              <CheckCircle size={14} className="text-cyan" />
              <span>{item.change}</span>
              <span className="update-date">{item.date}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {drug.updates?.newTrialData && (
      <div className="content-card">
        <h3 className="card-title">New Trial Data</h3>
        <ul className="updates-list">
          {drug.updates.newTrialData.map((item, index) => (
            <li key={index}>
              <FileText size={14} className="text-purple" />
              <span>{item.trial}</span>
              <span className="update-date">{item.date}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    {drug.updates?.competitorActivity && drug.updates.competitorActivity.length > 0 && (
      <div className="content-card">
        <h3 className="card-title">Competitor Activity</h3>
        <ul className="updates-list competitor">
          {drug.updates.competitorActivity.map((item, index) => (
            <li key={index}>
              <Info size={14} />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default DrugDetail;
