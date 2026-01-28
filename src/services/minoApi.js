// Mino API Service (formerly TinyFish)
const MINO_API_KEY = import.meta.env.VITE_MINO_API_KEY || 'sk-mino-ryawPOUEUxGTGSgoGX3Qg8DTkOV8Htm3';
const MINO_API_URL = import.meta.env.VITE_MINO_API_URL || 'https://mino.ai/v1/automation/run-sse';
const MODE = import.meta.env.VITE_MODE || 'demo';

// Debug logging
console.log('🔍 Mino API Configuration:');
console.log('  - MODE:', MODE);
console.log('  - API URL:', MINO_API_URL);
console.log('  - API Key:', MINO_API_KEY ? '✓ Set' : '✗ Missing');
console.log('  - Using:', MODE === 'live' ? '🔴 LIVE API CALLS' : '📊 DEMO MODE (simulated data)');

// Agent configuration for credential verification
const CREDENTIAL_AGENTS = {
  npiRegistry: {
    name: 'NPI Registry Agent',
    url: 'https://npiregistry.cms.hhs.gov/search',
    getGoal: (npiNumber) => `Search for NPI number ${npiNumber}. Extract the following data and respond in JSON format: {"npi": "number", "name": "full name", "credentials": "MD/DO/PA/NP", "taxonomy": "specialty description", "address": "practice address", "phone": "phone number", "status": "active/inactive"}`
  },
  texasMedicalBoard: {
    name: 'Texas Medical Board Agent',
    url: 'https://profile.tmb.state.tx.us/',
    getGoal: (lastName, firstName) => `Search for physician with last name ${lastName} and first name ${firstName}. Click on the matching result. Extract the following data and respond in JSON format: {"license_number": "TMB license number", "license_status": "Active/Inactive/Suspended", "issue_date": "YYYY-MM-DD", "expiration_date": "YYYY-MM-DD", "disciplinary_actions": "None/Description", "medical_school": "school name"}`
  },
  credentialNews: {
    name: 'Credential News Agent',
    url: 'https://news.google.com/search?q=healthcare+provider+licensing+OR+medical+board+OR+credentialing&hl=en-US&gl=US&ceid=US:en',
    getGoal: () => `Extract the top 3 most recent news articles related to healthcare provider licensing, credentialing, or medical board actions. For each article, extract: headline, source, published time (relative, e.g., '2 hours ago'), summary (first 100 characters), and article URL. Respond in JSON format: {"news": [{"headline": "...", "source": "...", "published_time": "...", "summary": "...", "url": "https://..."}]}. Only include articles published within the last 7 days.`
  }
};

// Agent configuration for P&T intelligence
const PT_AGENTS = {
  fda: {
    name: 'FDA Agent',
    url: 'https://www.accessdata.fda.gov/scripts/cder/daf/',
    getGoal: (drugName) => `Search for drug '${drugName}'. Click on the first result. Extract the following data and respond in JSON format: {"approval_dates": [{"indication": "...", "date": "YYYY-MM-DD"}], "approval_type": "Standard/Accelerated/Breakthrough", "label_url": "link to drug label PDF"}`
  },
  clinicalTrials: {
    name: 'Clinical Trials Agent',
    url: 'https://clinicaltrials.gov/api/v2/studies',
    getGoal: (drugName) => `Search for "${drugName}" completed Phase 2 or Phase 3 clinical trials. Extract the top 3 trials. Respond in JSON format: {"trials": [{"name": "...", "phase": "3", "enrollment": 1234, "outcome": "..."}]}`
  },
  pubmed: {
    name: 'PubMed Agent',
    url: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',
    getGoal: (drugName) => `Search for "${drugName} cardiovascular outcomes" publications. Extract top 3 most recent publications. Respond in JSON format: {"publications": [{"title": "...", "journal": "...", "year": 2024, "pmid": "..."}]}`
  },
  ptNews: {
    name: 'P&T News Agent',
    url: 'https://news.google.com/search?q=FDA+drug+approval+OR+formulary+OR+pharmacy+benefit&hl=en-US&gl=US&ceid=US:en',
    getGoal: (drugName) => `Extract the top 3 most recent news articles related to FDA drug approvals, formulary decisions, pharmacy benefits, or clinical guidelines for GLP-1 receptor agonists (like ${drugName}). For each article, extract: headline, source, published time (relative, e.g., '4 hours ago'), summary (first 100 characters), and article URL. Respond in JSON format: {"news": [{"headline": "...", "source": "...", "published_time": "...", "summary": "...", "url": "https://..."}]}. Only include articles published within the last 7 days.`
  }
};

// Simulated data for demo mode - Credential Verification
const SIMULATED_CREDENTIAL_DATA = {
  npiRegistry: {
    '1821089041': {
      npi: '1821089041',
      name: 'Maria Rodriguez',
      credentials: 'MD',
      taxonomy: 'Family Medicine',
      address: '123 Medical Plaza, Austin, TX 78701',
      phone: '(512) 555-0100',
      status: 'Active'
    },
    '1033226892': {
      npi: '1033226892',
      name: 'David Kim',
      credentials: 'PA-C',
      taxonomy: 'Physician Assistant',
      address: '456 Healthcare Drive, Houston, TX 77002',
      phone: '(713) 555-0200',
      status: 'Active'
    }
  },
  texasMedicalBoard: {
    'Rodriguez-Maria': {
      license_number: 'M12345',
      license_status: 'Active',
      issue_date: '2015-01-15',
      expiration_date: '2027-12-31',
      disciplinary_actions: 'None',
      medical_school: 'University of Texas Medical School'
    },
    'Kim-David': {
      license_number: 'PA9876',
      license_status: 'Active',
      issue_date: '2018-06-20',
      expiration_date: '2026-06-30',
      disciplinary_actions: 'None',
      medical_school: 'Baylor PA Program'
    }
  }
};

// Simulated data for demo mode - P&T Intelligence
const SIMULATED_PT_DATA = {
  fda: {
    approval_dates: [
      { indication: 'Type 2 Diabetes', date: '2017-12-05' },
      { indication: 'Weight Management', date: '2021-06-04' }
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
  }
};

/**
 * Simulate agent execution for demo mode
 */
const runSimulatedAgent = async (agentType, params, { onProgress, onComplete, onError }) => {
  const isCredentialAgent = CREDENTIAL_AGENTS[agentType];
  const isPTAgent = PT_AGENTS[agentType];

  const config = isCredentialAgent || isPTAgent;
  if (!config) {
    onError?.(`Unknown agent type: ${agentType}`);
    return;
  }

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  try {
    // Started
    await sleep(300);
    onProgress?.({
      status: 'running',
      message: `${config.name} started`,
      progress: 10
    });

    // Progress
    await sleep(800);
    onProgress?.({
      status: 'running',
      message: `Navigating to ${config.url}...`,
      progress: 30
    });

    await sleep(1000);
    onProgress?.({
      status: 'running',
      message: 'Searching...',
      progress: 60
    });

    await sleep(800);
    onProgress?.({
      status: 'running',
      message: 'Extracting data...',
      progress: 80
    });

    // Get simulated result
    let result;
    if (isCredentialAgent) {
      if (agentType === 'npiRegistry') {
        result = SIMULATED_CREDENTIAL_DATA.npiRegistry[params.npiNumber];
      } else if (agentType === 'texasMedicalBoard') {
        const key = `${params.lastName}-${params.firstName}`;
        result = SIMULATED_CREDENTIAL_DATA.texasMedicalBoard[key];
      }
    } else if (isPTAgent) {
      result = SIMULATED_PT_DATA[agentType];
    }

    // Complete
    await sleep(500);
    onComplete?.({
      status: 'completed',
      data: result,
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
 * Run a Mino agent with SSE streaming
 */
export const runAgent = async (agentType, params, { onProgress, onComplete, onError }) => {
  console.log(`🤖 Running ${agentType} agent in ${MODE} mode`);

  // Use simulated mode if MODE is 'demo'
  if (MODE === 'demo') {
    console.log(`  → Using simulated data for ${agentType}`);
    return runSimulatedAgent(agentType, params, { onProgress, onComplete, onError });
  }

  console.log(`  → Making LIVE API call for ${agentType}`);

  const config = CREDENTIAL_AGENTS[agentType] || PT_AGENTS[agentType];
  if (!config) {
    onError?.(`Unknown agent type: ${agentType}`);
    return;
  }

  const goal = config.getGoal(...Object.values(params));

  console.log(`  → Target URL: ${config.url}`);
  console.log(`  → Goal: ${goal.substring(0, 100)}...`);

  try {
    console.log(`  → Sending POST request to ${MINO_API_URL}`);
    const response = await fetch(MINO_API_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': MINO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: config.url,
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
    console.error(`  ✗ Mino API error for ${agentType}:`, error);
    onError?.({
      status: 'failed',
      error: error.message
    });
  }
};

/**
 * Run multiple agents concurrently
 * Supports both new format (agentConfigs array) and old format (agentTypes array with drugName)
 */
export const runMultipleAgents = async (
  agentConfigsOrTypes,
  drugNameOrCallbacks,
  callbacksOrUndefined
) => {
  let agentConfigs;
  let callbacks;

  // Detect which format is being used
  if (Array.isArray(agentConfigsOrTypes) && agentConfigsOrTypes.length > 0) {
    if (typeof agentConfigsOrTypes[0] === 'string') {
      // OLD FORMAT: runMultipleAgents(['evidence', 'guidelines'], 'Semaglutide', {callbacks})
      const agentTypes = agentConfigsOrTypes;
      const drugName = drugNameOrCallbacks;
      callbacks = callbacksOrUndefined;

      // Convert to new format for P&T agents
      agentConfigs = agentTypes.map(type => ({
        agentType: type,
        params: { drugName }
      }));
    } else {
      // NEW FORMAT: runMultipleAgents([{agentType, params}], {callbacks})
      agentConfigs = agentConfigsOrTypes;
      callbacks = drugNameOrCallbacks;
    }
  }

  const results = {};
  const errors = {};
  let completedCount = 0;

  const agentPromises = agentConfigs.map(({ agentType, params }) => {
    return runAgent(agentType, params, {
      onProgress: (progress) => {
        callbacks?.onAgentProgress?.(agentType, progress);
      },
      onComplete: (result) => {
        results[agentType] = result.data;
        completedCount++;
        callbacks?.onAgentComplete?.(agentType, result);

        if (completedCount === agentConfigs.length) {
          callbacks?.onAllComplete?.({ results, errors });
        }
      },
      onError: (error) => {
        errors[agentType] = error;
        completedCount++;

        if (completedCount === agentConfigs.length) {
          callbacks?.onAllComplete?.({ results, errors });
        }
      }
    });
  });

  await Promise.allSettled(agentPromises);
};

export default {
  runAgent,
  runMultipleAgents,
  CREDENTIAL_AGENTS,
  PT_AGENTS,
  MODE
};
