# Optum Rx P&T Committee Demo - TinyFish Integration

Interactive demonstration app showcasing TinyFish AI-powered clinical evidence gathering for P&T Committee workflows.

## Features

- **Password-Protected Access**: Secure entry with `optum2026` or `tinyfish2026`
- **3 Presentation Slides**: Problem → Solution → Live Demo
- **Interactive Dashboard**:
  - GLP-1 agonist class comparison
  - Efficacy scatter plot (HbA1c vs Weight loss)
  - Safety heatmap
  - FDA approval timeline
- **Drug Detail Pages**: 7 comprehensive tabs for each drug
  - Efficacy, Safety, Evidence Quality, Guidelines
  - Comparators, Peer Formularies, Updates & Alerts
- **Real-Time Agent Execution**:
  - Evidence, Guidelines, Safety, Comparator, Formulary agents
  - Live TinyFish API integration with SSE streaming
  - Live browser replay streams for all 5 agents
  - Demo mode with simulated data

## Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Environment Configuration

Create a `.env` file in the root directory:

```env
# TinyFish API Configuration
VITE_TINYFISH_API_KEY=your_api_key_here
VITE_TINYFISH_API_URL=https://mino.ai/v1/automation/run-sse

# Mode: 'demo' for simulated data, 'live' for real API calls
VITE_MODE=demo
```

### Modes

**Demo Mode** (`VITE_MODE=demo`):
- Uses simulated data with realistic timing
- No API calls made
- Perfect for presentations and testing
- Shows "📊 Demo" badge in Agent Panel

**Live Mode** (`VITE_MODE=live`):
- Makes real TinyFish API calls
- Streams actual data from clinical sources
- Displays live browser replay streams for all agents
- Shows real-time automation in action
- Requires valid API key
- Shows "🔴 Live" badge in Agent Panel

## Live Browser Streaming

When running in **Live Mode**, each agent displays a "Watch Live" button in the Agent Panel. Click any button to view that agent's real-time browser automation in an elegant focused viewer.

### Features:
- **"Watch Live" buttons** appear on each agent card when streaming is active
- **Focused stream viewer** with clean modal interface
- **Fullscreen mode** for detailed viewing
- **External link** to open stream in new tab
- **Live indicators** with pulsing red dot animations
- **Individual control** - watch one agent at a time

### How It Works:
1. When an agent starts, TinyFish API provides a `streamingUrl` via SSE events
2. A "Watch Live" button appears on that agent's card
3. Click the button to open a focused stream viewer showing:
   - Live browser as the agent navigates
   - Real-time searches and data extraction
   - Actual website interactions
   - Processing and result compilation

### UI Benefits:
- ✅ **Non-intrusive** - streams don't take over the screen
- ✅ **User control** - choose which agent to watch
- ✅ **Focused viewing** - one stream at a time for clarity
- ✅ **Professional appearance** - modal with controls
- ✅ **Trust & transparency** - see automation in action

## TinyFish API Integration

The app integrates with TinyFish Web Agent API to gather clinical evidence from:

### Agent Types

1. **Evidence Agent**
   - Searches PubMed and ClinicalTrials.gov
   - Extracts efficacy data (HbA1c, weight loss, CV outcomes)

2. **Guidelines Agent**
   - Queries ADA, ACC/AHA, AACE guidelines
   - Returns recommendations and evidence grades

3. **Safety Agent**
   - Monitors FDA MedWatch and FAERS databases
   - Identifies adverse events and safety alerts

4. **Comparator Agent**
   - Searches for head-to-head comparison studies
   - Extracts comparative effectiveness data

5. **Formulary Agent**
   - Queries Medicare Part D and PBM formularies
   - Returns tier placements and coverage data

### API Usage

```javascript
import { runMultipleAgents } from './services/tinyfishApi';

// Run all agents for a specific drug
runMultipleAgents(
  ['evidence', 'guidelines', 'safety', 'comparator', 'formulary'],
  'Semaglutide',
  {
    onAgentProgress: (agentType, progress) => {
      console.log(`${agentType}: ${progress.message}`);
    },
    onAgentComplete: (agentType, result) => {
      console.log(`${agentType} completed:`, result.data);
    },
    onAllComplete: ({ results, errors }) => {
      console.log('All agents complete', results);
    }
  }
);
```

## GLP-1 Agonist Data

The demo includes comprehensive clinical data for 6 drugs:

- **Semaglutide** (Ozempic/Wegovy/Rybelsus)
- **Tirzepatide** (Mounjaro/Zepbound)
- **Dulaglutide** (Trulicity)
- **Liraglutide** (Victoza/Saxenda)
- **Exenatide ER** (Bydureon)
- **Lixisenatide** (Adlyxin)

Each drug includes:
- Pivotal trial data (SUSTAIN, SURPASS, AWARD, LEADER, etc.)
- Safety profiles with adverse events
- Guideline recommendations
- Head-to-head comparison data
- Formulary coverage across Medicare Part D and major PBMs

## Project Structure

```
src/
├── components/
│   ├── PasswordScreen.jsx    # Authentication
│   ├── Presentation.jsx       # 3-slide presentation
│   ├── Dashboard.jsx          # Class overview dashboard
│   ├── DrugDetail.jsx         # Drug detail pages with tabs
│   └── AgentPanel.jsx         # Real-time agent execution
├── services/
│   └── tinyfishApi.js         # TinyFish API integration
├── data/
│   └── drugs.js               # Clinical data for 6 drugs
├── App.jsx                    # Main app with routing
└── index.css                  # Global styles
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Recharts** - Data visualizations
- **Lucide React** - Icons
- **TinyFish Web Agent API** - AI-powered web automation

## Usage

1. **Start the app**: Open `http://localhost:5173`
2. **Enter password**: `optum2026` or `tinyfish2026`
3. **Navigate slides**: Use arrow buttons or slide indicators
4. **Launch dashboard**: Click "Go to Dashboard" on Slide 3
5. **Run agents**: Click "Run Agents" in the Agent Panel
6. **View drug details**: Click any drug row in the comparison table
7. **Explore tabs**: Navigate through 7 tabs in drug detail view

## API Key Security

- Never commit `.env` files to version control
- The `.env` file is already in `.gitignore`
- For production, use environment variables from your hosting platform
- API key is passed in `X-API-Key` header for TinyFish API

## Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Support

- **TinyFish Docs**: https://docs.mino.ai/
- **TinyFish API**: https://mino.ai/v1/automation/run-sse
- **Get API Key**: https://app.mino.ai/signup

## License

Proprietary - Optum Rx Demo Application
