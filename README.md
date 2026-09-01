# LANDGUARD AI

### AI-Based Early Warning and Landslide Risk Monitoring System for the North Eastern Region (NER) of India

A hackathon-ready prototype that monitors environmental and terrain factors to estimate landslide risk across India's North Eastern Region. Built entirely with free, open-source technologies — no paid APIs, no API keys required.

---

## Problem Statement

The North Eastern Region of India contains mountainous and hilly terrain vulnerable to landslides, especially during monsoon season. Heavy rainfall, steep slopes, and unstable soil conditions contribute to recurring slope failures that threaten communities and infrastructure. Early identification of increasing risk can support better preparedness and response.

## Solution

LANDGUARD AI combines environmental indicators — rainfall, soil moisture, slope angle, ground movement, elevation, and historical landslide patterns — to produce a **Landslide Risk Score** from 0 to 100. The system visualizes vulnerable locations on an interactive GIS map, provides explainable AI outputs, and simulates escalating risk conditions for demonstration and planning.

### Risk Classification

| Score | Level | Color |
|-------|-------|-------|
| 0–25 | LOW | Green |
| 26–50 | MODERATE | Yellow |
| 51–75 | HIGH | Orange |
| 76–100 | CRITICAL | Red |

---

## Features

- **Dashboard** — KPI cards, regional risk gauge, mini risk map, top risk locations, trend charts
- **Interactive GIS Risk Map** — Leaflet + OpenStreetMap with 20 sample locations across 8 NER states, color-coded markers, click-to-view details, "View AI Analysis" button
- **AI Prediction** — Interactive risk calculator with sliders for all 6 inputs, transparent weighted scoring, explainable AI with contribution bars and natural-language explanation
- **Live Monitoring** — Simulated sensor cards (rainfall, soil moisture, ground movement, temperature), live charts, weather status
- **Landslide Simulation** — Animated 3-stage escalation (Normal → Risk Increasing → Critical) with dynamically updating sensors, charts, and risk score. Play, pause, and reset controls.
- **Alert Center** — Active alert cards with contributing factors and recommended actions, acknowledge/share buttons, full alert history table with search and filters
- **Locations** — Searchable, sortable, filterable table of all 20 demo locations with detail drawer
- **Analytics** — Risk distribution pie chart, state-wise comparison, rainfall vs risk, risk trend, alert frequency
- **Emergency Response** — Critical locations list, response priorities, recommended actions, emergency contact references
- **AI Assistant** — Local keyword-based chatbot with predefined responses (no external API)
- **Multilingual UI** — English, Hindi, and Assamese (extensible to more languages)
- **Responsive Design** — Mobile hamburger navigation, responsive grids and tables

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

---

## How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck
```

The app runs on `http://localhost:5173` by default.

---

## Demo Mode

This is a **prototype**. All data is simulated:

- Location data is sample/demo data for 20 locations across 8 NER states
- Sensor data is simulated — not from real sensors
- The risk engine is a transparent weighted scoring model — not a trained ML model
- Alerts are simulated — no real SMS or emergency notifications are sent
- The AI assistant uses keyword matching — not a live AI service

**Disclaimer:** Prototype estimates only. This system is NOT intended for real-world emergency decisions. Always follow instructions from official disaster management authorities.

---

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Layout.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── RiskGauge.tsx
│   ├── RiskCard.tsx
│   ├── SensorCard.tsx
│   ├── RiskMap.tsx
│   ├── RiskChart.tsx
│   ├── AlertCard.tsx
│   ├── ExplainableRisk.tsx
│   ├── SimulationController.tsx
│   └── AIAssistant.tsx
├── pages/            # Page-level views
│   ├── Dashboard.tsx
│   ├── MapPage.tsx
│   ├── PredictionPanel.tsx
│   ├── LiveMonitoring.tsx
│   ├── AlertsPage.tsx
│   ├── LocationsPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── EmergencyResponse.tsx
│   └── AboutPage.tsx
├── data/             # Demo/simulated data
│   ├── locations.ts
│   ├── alerts.ts
│   ├── sensors.ts
│   └── translations.ts
├── services/         # Service layer (future API integration)
│   └── api.ts
├── hooks/            # Custom React hooks
│   └── useSimulation.ts
├── types/            # TypeScript interfaces
│   └── index.ts
└── utils/            # Utility functions
    ├── risk.ts
    └── format.ts
```

---

## Future ML Integration

The prototype risk engine in `src/utils/risk.ts` uses a transparent weighted scoring model:

- Rainfall: 30%
- Soil Moisture: 25%
- Slope: 20%
- Ground Movement: 15%
- Historical Risk: 10%
- Elevation: contextual (not weighted into score)

The service layer (`src/services/api.ts`) isolates risk calculation from UI. The `predictRisk()` function can be replaced with a trained ML model (Random Forest, XGBoost) using historical landslide and environmental datasets, without changing any UI components.

## Future API Integration

The service layer is structured for future backend connection:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/risk/predict` | Predict risk from inputs |
| GET | `/api/locations` | All monitored locations |
| GET | `/api/sensors` | Real-time sensor data |
| GET | `/api/alerts` | Active and historical alerts |
| GET | `/api/historical` | Historical landslide data |

Currently all functions return local demo data. No paid hosting or API keys required.

---

## NER States Covered

- Arunachal Pradesh
- Assam
- Meghalaya
- Manipur
- Mizoram
- Nagaland
- Tripura
- Sikkim

---

## License

Open source — free to use and modify for educational and hackathon purposes.
