# LANDGUARD AI

### AI-Based Early Warning and Landslide Risk Monitoring System for the North Eastern Region (NER) of India

**PROTOTYPE / EARLY-WARNING RESEARCH SYSTEM**
Not for real-world emergency decisions. Follow official disaster-management authorities.

---

## Problem Statement

The North Eastern Region of India contains mountainous and hilly terrain vulnerable to landslides, especially during monsoon season. Heavy rainfall, steep slopes, and unstable soil conditions contribute to recurring slope failures that threaten communities and infrastructure. Early identification of increasing risk can support better preparedness and response.

## Solution

LANDGUARD AI combines environmental indicators — rainfall, soil moisture, slope angle, ground movement, elevation, and historical landslide patterns — to produce a **Landslide Risk Score** from 0 to 100. The system visualizes vulnerable locations on an interactive GIS map, provides explainable AI outputs, and generates dynamic alerts from calculated risk.

### Risk Classification

| Score | Level | Color |
|-------|-------|-------|
| 0–25 | LOW | Green |
| 26–50 | MODERATE | Yellow |
| 51–75 | HIGH | Orange |
| 76–100 | CRITICAL | Red |

---

## Features

- **Dashboard** — Dynamic KPI cards (calculated from location data), regional risk gauge, mini risk map, top risk locations, trend charts
- **Interactive GIS Risk Map** — Leaflet + OpenStreetMap with 20 sample locations across 8 NER states, color-coded markers, click-to-view details with data status, "Analyze this location" button, search + state + risk-level filters
- **AI Prediction** — Interactive risk calculator with sliders for all 6 inputs, transparent weighted scoring via riskService, explainable AI with contribution bars and natural-language explanation
- **Monitoring** — Per-variable data source indicators (LIVE / FALLBACK / DEMO SENSOR), refresh button, auto-refresh every 5 minutes, location selector, 3-stage landslide simulation with SIMULATION MODE banner
- **Alerts** — Alerts generated dynamically from calculated risk scores, contributing factors, data source labels, acknowledge/share buttons, alert history table with search and filters
- **Locations** — Searchable, sortable, filterable table with detail drawer showing all sensor data + data source
- **Analytics** — Risk distribution, state-wise risk, rainfall vs risk, risk trend, alert frequency — all calculated from application data
- **Emergency Response** — Critical locations list (dynamic), response priorities, recommended actions, emergency contact references
- **AI Assistant** — Local keyword-based chatbot with predefined responses
- **Multilingual UI** — English, Hindi, and Assamese (extensible)
- **Global Data Status** — LIVE / FALLBACK / SIMULATION / ERROR indicator in header

---

## Data Source Architecture

| Variable | Source | Status |
|----------|--------|--------|
| Rainfall / Weather | OpenWeatherMap free API (when configured) | LIVE or FALLBACK |
| Soil Moisture | No live source — fallback demo data | FALLBACK |
| Ground Movement | No live source — DEMO SENSOR DATA | FALLBACK |
| Historical Risk | Sample data in data file | FALLBACK |
| Terrain (slope, elevation) | Geographic data in data file | Static |

The app automatically falls back to demo data when no API key is configured or when an API call fails. Data status is shown per variable and globally in the header.

---

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| React + TypeScript | Frontend framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Styling |
| Leaflet + OpenStreetMap | Interactive maps (free, no API key) |
| Recharts | Charts and data visualization |
| Lucide React | Icons |
| OpenWeatherMap API | Weather data (free tier, optional) |

---

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/            # Page-level views (9 pages)
├── data/             # Static/fallback data
│   ├── fallbackData.ts    # Location terrain data + fallback environmental values
│   ├── locations.ts       # Re-exports from fallbackData
│   ├── sensors.ts         # Re-exports fallback history generator
│   ├── alerts.ts          # Re-exports from alertService
│   └── translations.ts    # i18n strings (EN, HI, AS)
├── services/         # Data service layer (UI calls these, not data files directly)
│   ├── weatherService.ts        # OpenWeatherMap API + fallback
│   ├── riskService.ts           # Prototype Risk Engine (calculateRisk, predictRisk)
│   ├── locationService.ts       # Merges terrain + environmental data, computes risk
│   ├── alertService.ts          # Generates alerts from calculated risk
│   ├── groundMovementService.ts # GPS/InSAR/IoT-ready (fallback for now)
│   └── historicalRiskService.ts # Historical landslide risk data layer
├── hooks/            # Custom React hooks
│   ├── useLocations.ts    # Global data state (fetch, refresh, status, alerts)
│   └── useSimulation.ts   # Simulation engine
├── types/            # TypeScript interfaces
│   ├── risk.ts       # RiskLevel, RiskInputs, RiskResult, RiskFactor
│   ├── location.ts   # Location, NERState, DataStatus
│   ├── weather.ts    # WeatherData, weatherCodeToRainfall
│   ├── alert.ts      # Alert
│   └── index.ts      # Barrel re-exports
└── utils/            # Utility functions
    ├── risk.ts       # Re-exports from riskService + color helpers
    └── format.ts     # Date/time formatting
```

---

## How to Run

```bash
# Install dependencies
npm install

# Copy environment template (optional — app works without API keys)
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npm run typecheck
```

The app runs on `http://localhost:5173` by default. **No API keys required** — the app works immediately with fallback demo data.

---

## Configuration (Optional)

To enable live weather data, get a free API key from [OpenWeatherMap](https://openweathermap.org/api) and add it to `.env`:

```
VITE_OPENWEATHER_API_KEY=your_actual_key_here
```

If not set or if the API fails, the app automatically uses fallback data and displays "FALLBACK" status.

---

## Future ML Integration

The prototype risk engine in `src/services/riskService.ts` uses a transparent weighted scoring model. The `calculateRisk()` function can be replaced with a trained ML model call:

```typescript
// Future implementation:
// export async function predictRisk(inputs: RiskInputs): Promise<RiskResult> {
//   const res = await fetch('/api/risk/predict', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(inputs),
//   });
//   const data: RiskPredictResponse = await res.json();
//   return { ...data, model: 'XGBoost v1.0', dataSource: 'LIVE' };
// }
```

Replace this prototype calculation with a validated Random Forest/XGBoost model after training and evaluation on appropriate historical datasets.

## Future API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/risk/predict` | Predict risk from inputs |
| GET | `/api/locations` | All monitored locations |
| GET | `/api/sensors` | Real-time sensor data |
| GET | `/api/alerts` | Active and historical alerts |
| GET | `/api/historical` | Historical landslide data |

---

## How to Push to GitHub

```bash
# Initialize git repo (if not already)
git init

# Add all files (.env is gitignored)
git add .

# Commit
git commit -m "LANDGUARD AI - functional data-driven prototype"

# Create a repo on GitHub, then push:
git remote add origin https://github.com/yourusername/landguard-ai.git
git branch -M main
git push -u origin main
```

The `.env` file is in `.gitignore` — your API keys will never be committed. Only `.env.example` with placeholders is shared.

---

## NER States Covered

Arunachal Pradesh, Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Sikkim

---

## License

Open source — free to use and modify for educational and hackathon purposes.
