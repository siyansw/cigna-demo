# Healthcare Clinical Intelligence Platform - TinyFish Integration

Interactive demonstration app showcasing TinyFish AI-powered automation for two key healthcare workflows:
1. **Provider Credential Verification** - Real-time NPI and medical license lookups
2. **P&T Clinical Intelligence** - Automated drug evidence gathering for formulary decisions

## Features

### Credential Verification Dashboard
- **Automated Provider Lookups**: Real-time verification of 2 healthcare providers
- **NPI Registry Integration**: Instant provider data from CMS NPI Registry API
- **Medical License Verification**: Texas Medical Board automated searches
- **Live Streaming**: Watch agents execute credential checks in real-time
- **News Feed**: Latest credentialing and licensing industry updates

### P&T Clinical Intelligence Dashboard
- **FDA Data Extraction**: Automated scraping of Drugs@FDA database
- **Clinical Trials Search**: ClinicalTrials.gov API integration
- **PubMed Research**: Real-time literature search via NCBI E-utilities
- **Guideline Integration**: ADA/ACC/AHA standards of care
- **Live Streaming**: Watch agents gather clinical evidence in real-time
- **News Feed**: Latest pharmaceutical and formulary news

### Common Features
- **Password-Protected Access**: Secure entry with `demo2026` or `tinyfish2026`
- **Watch Live Modal**: Real-time SSE streaming of agent execution with logs
- **Persistent State**: Dashboard loads instantly with previous data
- **Refresh Capability**: Update data with smooth animations
- **Demo Mode**: Simulated data for presentations
- **Live Mode**: Real TinyFish API integration with browser streaming

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
# TinyFish API Configuration (Mino.ai)
VITE_MINO_API_KEY=your_api_key_here
VITE_MINO_API_URL=https://mino.ai/v1/automation/run-sse

# Mode: 'demo' for simulated data, 'live' for real API calls
VITE_MODE=demo
```

### Modes

**Demo Mode** (`VITE_MODE=demo`):
- Uses simulated data with realistic timing
- No API calls made
- Perfect for presentations and testing
- Shows "📊 Demo" badge

**Live Mode** (`VITE_MODE=live`):
- Makes real Mino API calls
- Streams actual data from sources
- Displays live browser replay streams
- Shows real-time automation in action
- Requires valid API key
- Shows "🔴 Live" badge

## Watch Live Streaming

When running in **Live Mode**, the "Watch Live" button appears after clicking "Run Verification" or "Run Clinical Review".

### Features:
- **Real-time agent logs** via Server-Sent Events (SSE)
- **Progress tracking** for each agent (NPI, TMB, FDA, PubMed, etc.)
- **JSON result display** with syntax highlighting
- **Auto-scroll** as new logs arrive
- **Modal viewer** with clean interface
- **Execution timing** for performance monitoring

### How It Works:
1. User clicks "Run Verification" or "Run Clinical Review"
2. Multiple agents start executing in parallel
3. "Watch Live" button appears
4. Click to open modal showing:
   - Each agent's navigation steps
   - Data extraction progress
   - Final JSON results
   - Total execution time

## Data Sources

### Credential Verification
1. **NPI Registry API** - `https://npiregistry.cms.hhs.gov/api/`
   - Provider name, credentials, specialty, address
   - Speed: 1-3 seconds per lookup

2. **Texas Medical Board** - `https://profile.tmb.state.tx.us/`
   - License number, status, expiration, disciplinary actions
   - Speed: 5-8 seconds per lookup

3. **Google News / RSS** - Healthcare credentialing news

### P&T Clinical Intelligence
1. **FDA Drugs@FDA** - `https://www.accessdata.fda.gov/scripts/cder/daf/`
   - Approval dates, indications, labels
   - Speed: 8-10 seconds

2. **ClinicalTrials.gov API** - `https://clinicaltrials.gov/api/v2/studies`
   - Trial names, phases, enrollment, outcomes
   - Speed: 5-7 seconds

3. **PubMed API** - `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/`
   - Publications, journals, PMIDs
   - Speed: 3-5 seconds

4. **ADA Guidelines** - Pre-cached for speed
   - Recommendation class, evidence level

5. **Google News / RSS** - Pharmaceutical and FDA news

## Demo Providers

**Provider 1: Dr. Maria Rodriguez, MD**
- NPI: 1821089041 (real, searchable)
- Specialty: Family Medicine
- Texas Medical License: Active

**Provider 2: David Kim, PA-C**
- NPI: 1033226892 (real, searchable)
- Specialty: Physician Assistant
- Texas Medical License: Active

## Demo Drug

**Semaglutide (Ozempic/Wegovy)**
- Manufacturer: Novo Nordisk
- Class: GLP-1 receptor agonist
- Indications: Type 2 diabetes, weight management

## Mino API Integration

### Example Agent Configuration

**NPI Registry Search:**
```json
{
  "url": "https://npiregistry.cms.hhs.gov/search",
  "goal": "Search for NPI number 1821089041. Extract: npi, name, credentials, taxonomy, address, phone, status. Respond in JSON format.",
  "browser_profile": "lite"
}
```

**Texas Medical Board Search:**
```json
{
  "url": "https://profile.tmb.state.tx.us/",
  "goal": "Search for physician Rodriguez, Maria. Click matching result. Extract: license_number, license_status, issue_date, expiration_date, disciplinary_actions, medical_school. Respond in JSON format.",
  "browser_profile": "lite"
}
```

## Project Structure

```
src/
├── components/
│   ├── PasswordScreen.jsx      # Authentication
│   ├── LandingMenu.jsx         # Dashboard selection menu (NEW)
│   ├── CredentialDashboard.jsx # Provider verification (NEW)
│   ├── PTDashboard.jsx         # P&T clinical intelligence (NEW)
│   ├── WatchLiveModal.jsx      # SSE streaming viewer (NEW)
│   ├── NewsFeed.jsx            # Industry news component (NEW)
│   ├── AgentPanel.jsx          # Agent execution panel
│   └── StreamViewer.jsx        # Browser stream viewer
├── services/
│   └── minoApi.js              # Mino API integration (UPDATED)
├── data/
│   ├── providers.js            # Provider data (NEW)
│   └── drugs.js                # Drug data
├── App.jsx                     # Main app with routing
└── index.css                   # Global styles
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Framer Motion** - Animations
- **Recharts** - Data visualizations
- **Lucide React** - Icons
- **Mino API (TinyFish)** - AI-powered web automation

## Usage

1. **Start the app**: Open `http://localhost:5173`
2. **Enter password**: `demo2026` or `tinyfish2026`
3. **Select dashboard**: Choose Credential Verification or P&T Intelligence
4. **Run automation**: Click "Run Verification" or "Run Clinical Review"
5. **Watch live**: Click "Watch Live" to see agents in action
6. **View results**: See provider cards or clinical data populate
7. **Refresh data**: Click refresh icon to update with latest data

## API Key Security

- Never commit `.env` files to version control
- The `.env` file is already in `.gitignore`
- For production, use environment variables from your hosting platform
- API key is passed in `X-API-Key` header for Mino API

## Performance

**Credential Verification:**
- Target: <90 seconds for full 2-provider verification
- Typical: 60-80 seconds with parallel agent execution

**P&T Clinical Intelligence:**
- Target: <60 seconds for full drug review
- Typical: 45-55 seconds with parallel agent execution

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

- **Mino API Docs**: https://docs.mino.ai/
- **Mino API Endpoint**: https://mino.ai/v1/automation/run-sse
- **Get API Key**: https://app.mino.ai/signup

## License

Proprietary - Healthcare Clinical Intelligence Demo Application
