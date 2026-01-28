// TinyFish API Service
const TINYFISH_API_KEY = import.meta.env.VITE_TINYFISH_API_KEY || 'sk-mino-ryawPOUEUxGTGSgoGX3Qg8DTkOV8Htm3';
const TINYFISH_API_URL = import.meta.env.VITE_TINYFISH_API_URL || 'https://mino.ai/v1/automation/run-sse';
const MODE = import.meta.env.VITE_MODE || 'demo';

// Debug logging
console.log('🔍 TinyFish API Configuration:');
console.log('  - MODE:', MODE);
console.log('  - API URL:', TINYFISH_API_URL);
console.log('  - API Key:', TINYFISH_API_KEY ? '✓ Set' : '✗ Missing');

// Agent configuration with their specific goals
const AGENT_CONFIGS = {
  evidence: {
    name: 'Evidence Agent',
    urls: [
      'https://pubmed.ncbi.nlm.nih.gov/',
      'https://clinicaltrials.gov/'
    ],
    getGoal: (drugName) => `Search for "${drugName}" clinical trials focusing on efficacy data including HbA1c reduction, weight loss, and cardiovascular outcomes. Return structured JSON with trial names, outcomes, and key findings.`
  },
  guidelines: {
    name: 'Guidelines Agent',
    urls: [
      'https://diabetesjournals.org/care/pages/diabetes_care_guidelines',
      'https://www.acc.org/guidelines'
    ],
    getGoal: (drugName) => `Search for clinical guidelines and recommendations for "${drugName}" from ADA, ACC/AHA, and AACE. Return structured JSON with guideline recommendations, preferred status, and evidence grades.`
  },
  safety: {
    name: 'Safety Agent',
    urls: [
      'https://www.fda.gov/drugs/drug-safety-and-availability',
      'https://www.accessdata.fda.gov/scripts/cder/safetylabelingchanges/'
    ],
    getGoal: (drugName) => `Search FDA databases for safety information about "${drugName}" including adverse events, black box warnings, and safety alerts. Return structured JSON with safety profile and risk information.`
  },
  comparator: {
    name: 'Comparator Agent',
    urls: [
      'https://pubmed.ncbi.nlm.nih.gov/',
      'https://www.cochrane.org/search'
    ],
    getGoal: (drugName) => `Search for head-to-head comparison studies involving "${drugName}" versus other GLP-1 agonists. Return structured JSON with comparative efficacy and safety data.`
  },
  formulary: {
    name: 'Formulary Agent',
    urls: [
      'https://q1medicare.com/PartD-SearchPDPMedicare-2024PlanFinder.php',
      'https://www.pbmi.com/formulary-search'
    ],
    getGoal: (drugName) => `Search for formulary coverage of "${drugName}" in Medicare Part D and major PBMs. Return structured JSON with tier placements, prior authorization requirements, and coverage percentages.`
  },
  news: {
    name: 'News Intelligence Agent',
    urls: [
      'https://www.google.com/search?q=GLP-1+agonist+news+FDA+clinical+trials&tbm=nws',
      'https://www.medscape.com/',
      'https://www.healio.com/news/endocrinology'
    ],
    getGoal: (drugName) => `Search for the latest 5 news headlines about GLP-1 receptor agonists, specifically related to "${drugName}" class, including FDA approvals, clinical trial results, guideline updates, or regulatory changes from the past 7 days.

Return JSON in this EXACT format:
{
  "data": [
    {
      "headline": "exact headline text",
      "source": "source name",
      "date": "relative time like '2 days ago'",
      "brief_summary": "one sentence summary"
    }
  ]
}`
  }
};

// Simulated data for demo mode
const SIMULATED_RESULTS = {
  evidence: {
    trials: [
      { name: 'SUSTAIN-1', outcome: 'HbA1c reduction: -1.5%' },
      { name: 'SUSTAIN-6', outcome: 'CV benefit: 26% reduction' }
    ],
    count: 23
  },
  guidelines: {
    guidelines: [
      { name: 'ADA 2024', recommendation: 'Preferred agent' },
      { name: 'ACC/AHA', recommendation: 'Class IIa' }
    ],
    count: 4
  },
  safety: {
    alerts: [],
    blackBoxWarnings: ['Thyroid C-cell tumors'],
    count: 0
  },
  comparator: {
    comparisons: [
      { drug: 'Dulaglutide', outcome: 'Superior HbA1c reduction' },
      { drug: 'Liraglutide', outcome: 'Similar weight loss' }
    ],
    count: 6
  },
  formulary: {
    plans: [
      { name: 'Medicare Part D', tier: 3, coverage: '85%' },
      { name: 'Express Scripts', tier: 2, coverage: '92%' }
    ],
    count: 12
  },
  news: {
    headlines: [
      { headline: 'FDA approves expanded indication for GLP-1 in cardiovascular risk reduction', source: 'FDA News', date: '3 hours ago', summary: 'New labeling update for semaglutide' },
      { headline: 'ADA releases updated treatment guidelines favoring GLP-1 therapies', source: 'American Diabetes Association', date: '6 hours ago', summary: 'Class I recommendation for CV benefit' },
      { headline: 'Medicare expands coverage for GLP-1 medications in obesity treatment', source: 'CMS', date: '1 day ago', summary: 'Part D now covers weight loss indication' },
      { headline: 'New trial data shows superior efficacy of dual GLP-1/GIP agonists', source: 'NEJM', date: '2 days ago', summary: 'Tirzepatide demonstrates greater HbA1c reduction' },
      { headline: 'Supply chain improvements expected for GLP-1 medications in Q2', source: 'Medscape', date: '3 days ago', summary: 'Manufacturing capacity expanded' }
    ],
    count: 5
  }
};

/**
 * Simulate agent execution for demo mode
 */
const runSimulatedAgent = async (agentType, drugName, { onProgress, onComplete, onError }) => {
  const config = AGENT_CONFIGS[agentType];
  if (!config) {
    onError?.(`Unknown agent type: ${agentType}`);
    return;
  }

  // Simulate delays
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    // Started
    await sleep(500);
    onProgress?.({
      status: 'running',
      message: `${config.name} started`,
      progress: 10
    });

    // Progress
    await sleep(1000);
    onProgress?.({
      status: 'running',
      message: `Searching ${config.urls[0]}...`,
      progress: 50
    });

    // More progress
    await sleep(1500);
    onProgress?.({
      status: 'running',
      message: 'Processing results...',
      progress: 80
    });

    // Complete
    await sleep(800);
    onComplete?.({
      status: 'completed',
      data: SIMULATED_RESULTS[agentType],
      runId: `sim_${agentType}_${Date.now()}`
    });
  } catch (error) {
    onError?.({
      status: 'failed',
      error: error.message
    });
  }
};

/**
 * Run a TinyFish agent with SSE streaming
 * @param {string} agentType - Type of agent (evidence, guidelines, safety, comparator, formulary)
 * @param {string} drugName - Name of the drug to research
 * @param {function} onProgress - Callback for progress updates
 * @param {function} onComplete - Callback for completion
 * @param {function} onError - Callback for errors
 */
export const runAgent = async (agentType, drugName, { onProgress, onComplete, onError }) => {
  console.log(`🤖 Running ${agentType} agent in ${MODE} mode for ${drugName}`);

  // Use simulated mode if MODE is 'demo'
  if (MODE === 'demo') {
    console.log(`  → Using simulated data for ${agentType}`);
    return runSimulatedAgent(agentType, drugName, { onProgress, onComplete, onError });
  }

  console.log(`  → Making LIVE API call for ${agentType}`);

  const config = AGENT_CONFIGS[agentType];
  if (!config) {
    onError?.(`Unknown agent type: ${agentType}`);
    return;
  }

  const url = config.urls[0]; // Use first URL for now
  const goal = config.getGoal(drugName);

  console.log(`  → Target URL: ${url}`);
  console.log(`  → Goal: ${goal.substring(0, 100)}...`);

  try {
    console.log(`  → Sending POST request to ${TINYFISH_API_URL}`);
    const response = await fetch(TINYFISH_API_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': TINYFISH_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        goal,
        browser_profile: 'lite'
      })
    });

    if (!response.ok) {
      console.error(`  ✗ HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log(`  ✓ Response received, starting SSE stream...`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          try {
            const event = JSON.parse(data);

            switch (event.type) {
              case 'STARTED':
                console.log(`  → STARTED: ${event.runId}`);
                onProgress?.({
                  status: 'running',
                  message: `${config.name} started`,
                  runId: event.runId
                });
                break;

              case 'STREAMING_URL':
                console.log(`  → STREAMING_URL: ${event.streamingUrl}`);
                onProgress?.({
                  status: 'running',
                  message: 'Browser stream active',
                  runId: event.runId,
                  streamingUrl: event.streamingUrl
                });
                break;

              case 'PROGRESS':
                console.log(`  → PROGRESS: ${event.purpose || 'Processing...'}`);
                onProgress?.({
                  status: 'running',
                  message: event.purpose || 'Processing...',
                  runId: event.runId
                });
                break;

              case 'COMPLETE':
                console.log(`  → COMPLETE: ${event.status}`);
                if (event.status === 'COMPLETED') {
                  console.log(`  ✓ Success! Data:`, event.resultJson);
                  onComplete?.({
                    status: 'completed',
                    data: event.resultJson,
                    runId: event.runId
                  });
                } else if (event.status === 'FAILED') {
                  console.error(`  ✗ Failed:`, event.error);
                  onError?.({
                    status: 'failed',
                    error: event.error,
                    runId: event.runId
                  });
                }
                break;

              case 'HEARTBEAT':
                // Keep connection alive
                break;

              default:
                console.log('  → Unknown event type:', event.type);
            }
          } catch (e) {
            console.error('Error parsing SSE event:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error(`  ✗ TinyFish API error for ${agentType}:`, error);
    onError?.({
      status: 'failed',
      error: error.message
    });
  }
};

/**
 * Run multiple agents concurrently
 * @param {string[]} agentTypes - Array of agent types to run
 * @param {string} drugName - Name of the drug to research
 * @param {function} onAgentProgress - Callback for individual agent progress
 * @param {function} onAgentComplete - Callback for individual agent completion
 * @param {function} onAllComplete - Callback when all agents complete
 */
export const runMultipleAgents = async (
  agentTypes,
  drugName,
  { onAgentProgress, onAgentComplete, onAllComplete }
) => {
  const results = {};
  const errors = {};
  let completedCount = 0;

  const agentPromises = agentTypes.map(agentType => {
    return runAgent(agentType, drugName, {
      onProgress: (progress) => {
        onAgentProgress?.(agentType, progress);
      },
      onComplete: (result) => {
        results[agentType] = result.data;
        completedCount++;
        onAgentComplete?.(agentType, result);

        if (completedCount === agentTypes.length) {
          onAllComplete?.({ results, errors });
        }
      },
      onError: (error) => {
        errors[agentType] = error;
        completedCount++;

        if (completedCount === agentTypes.length) {
          onAllComplete?.({ results, errors });
        }
      }
    });
  });

  await Promise.allSettled(agentPromises);
};

export default {
  runAgent,
  runMultipleAgents,
  AGENT_CONFIGS,
  MODE
};
