import { Info, Cpu, Database, ArrowDown, Server, GitBranch, Layers, Shield, Satellite, ExternalLink } from "lucide-react";

export function AboutPage() {
  const workflow = [
    "Data Collection (NASA IMERG + Weather API)",
    "Data Processing",
    "Feature Analysis",
    "Risk Score",
    "GIS Visualization",
    "Early Warning",
    "Response Support",
  ];

  const futureEndpoints = [
    { method: "POST", path: "/api/risk/predict", desc: "Predict landslide risk score from inputs" },
    { method: "GET", path: "/api/locations", desc: "Retrieve all monitored locations" },
    { method: "GET", path: "/api/sensors", desc: "Get real-time sensor data" },
    { method: "GET", path: "/api/alerts", desc: "Fetch active and historical alerts" },
    { method: "GET", path: "/api/historical", desc: "Historical landslide and risk data" },
    { method: "GET", path: "/functions/v1/imerg-precipitation", desc: "NASA IMERG precipitation proxy (active)" },
  ];

  const techStack = ["React", "TypeScript", "Vite", "Tailwind CSS", "Leaflet", "OpenStreetMap", "Recharts", "Lucide React", "Supabase Edge Functions"];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Info className="text-cyan-400" /> About LANDGUARD AI
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          AI-Based Early Warning and Landslide Risk Monitoring System for NER India
        </p>
      </div>

      {/* The Problem */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">The Problem</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          The North Eastern Region of India contains mountainous and hilly areas that can be vulnerable to landslides.
          Heavy monsoon rainfall, steep slopes, and complex terrain make parts of this region susceptible to slope
          failures. Early identification of increasing risk can support better preparedness and response, potentially
          reducing the impact on communities in vulnerable zones.
        </p>
      </section>

      {/* Our Solution */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3">Our Solution</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          LANDGUARD AI combines environmental indicators — NASA IMERG satellite precipitation, soil moisture, slope angle,
          ground movement, elevation, and historical landslide patterns — to estimate landslide risk and visualize vulnerable
          locations on an interactive GIS map. The system produces a transparent risk score from 0–100 and provides explainable
          AI outputs showing which factors contribute most to risk at any given location.
        </p>
      </section>

      {/* Workflow */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-4">System Workflow</h2>
        <div className="flex flex-col gap-2">
          {workflow.map((step, i) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm font-bold shrink-0">
                {i + 1}
              </div>
              <span className="text-sm text-slate-300">{step}</span>
              {i < workflow.length - 1 && <ArrowDown size={14} className="text-slate-600 ml-auto" />}
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Layers size={20} className="text-cyan-400" /> Technology Stack
        </h2>
        <div className="flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span key={tech} className="px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-300">
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Database size={20} className="text-cyan-400" /> Data Source Architecture
        </h2>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-800/40 border-l-4 border-cyan-500">
            <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Satellite size={16} className="text-cyan-400" />
              NASA GPM IMERG — Near-Real-Time Precipitation
            </div>
            <p className="text-xs text-slate-400 mt-1">
              IMERG V07B · Early Run · 0.1° (~10 km) spatial resolution · ~4 hour latency.
              Accessed via a Supabase Edge Function proxy that holds the NASA Earthdata Bearer token server-side.
              Provides 30-min, 3-hour, 24-hour, 3-day, and 7-day precipitation accumulations.
              Falls back to demo data if NASA is unavailable — never labels fallback as NASA data.
            </p>
            <a
              href="https://gpm.nasa.gov/data/imerg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 mt-2"
            >
              Official NASA IMERG Information <ExternalLink size={12} />
            </a>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40 border-l-4 border-emerald-500">
            <div className="text-sm font-semibold text-slate-200">Weather / Temperature / Humidity</div>
            <p className="text-xs text-slate-400 mt-1">OpenWeatherMap free API when API key is configured (VITE_OPENWEATHER_API_KEY). Falls back to demo data automatically. Data status shown per variable.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40 border-l-4 border-yellow-500">
            <div className="text-sm font-semibold text-slate-200">Soil Moisture</div>
            <p className="text-xs text-slate-400 mt-1">No live source configured. Uses fallback demo data. Architecture supports future sensor / remote-sensing integration via VITE_SOIL_MOISTURE_API_URL.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40 border-l-4 border-pink-500">
            <div className="text-sm font-semibold text-slate-200">Ground Movement</div>
            <p className="text-xs text-slate-400 mt-1">No live source configured. Uses DEMO SENSOR DATA. Architecture supports GPS, InSAR, IoT sensors via VITE_GROUND_MOVEMENT_API_URL.</p>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/40 border-l-4 border-purple-500">
            <div className="text-sm font-semibold text-slate-200">Historical Landslide Risk</div>
            <p className="text-xs text-slate-400 mt-1">Sample data separated from live environmental inputs. Structured for future import of official datasets (GSI, NRSC, Bhuvan).</p>
          </div>
        </div>
      </section>

      {/* Future ML Architecture */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Cpu size={20} className="text-cyan-400" /> Future Production Architecture
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          The current prototype uses a transparent weighted scoring engine that is intentionally structured for easy
          replacement with a trained machine learning model. The service layer separates risk calculation from UI
          components, so the <code className="text-cyan-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">predictRisk()</code> function
          can be swapped for a Random Forest, XGBoost, or other trained model using historical landslide and
          environmental datasets. NASA IMERG multi-window rainfall features (24h, 3d, 7d) are already structured as
          model inputs.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Random Forest", "XGBoost", "Historical Datasets", "Real Sensor Networks", "NASA IMERG Features"].map((item) => (
            <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-300">
              <GitBranch size={14} className="text-slate-500" /> {item}
            </span>
          ))}
        </div>
      </section>

      {/* Future API */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Server size={20} className="text-cyan-400" /> API Structure
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          The project uses a Supabase Edge Function to proxy NASA IMERG requests (keeping the NASA token server-side).
          The service layer (<code className="text-cyan-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">src/services/</code>)
          can be connected to additional backend endpoints:
        </p>
        <div className="space-y-2">
          {futureEndpoints.map((ep) => (
            <div key={ep.path} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40">
              <span className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                ep.method === "GET" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
              }`}>
                {ep.method}
              </span>
              <span className="text-sm font-mono text-slate-300">{ep.path}</span>
              <span className="text-xs text-slate-500 ml-auto hidden sm:inline">{ep.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Demo disclaimer */}
      <section className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
        <h2 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
          <Shield size={20} /> Prototype Disclaimer
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          PROTOTYPE / EARLY-WARNING RESEARCH SYSTEM. Not for real-world emergency decisions. Follow official disaster-management authorities.
          The AI risk engine is a transparent weighted model — not a scientifically validated ML model. NASA IMERG provides precipitation
          estimates only — it does NOT predict landslides. NASA IMERG data has approximately 4-hour latency and 0.1° (~10 km) spatial
          resolution. Soil moisture and ground movement use fallback demo data unless a real sensor source is connected.
        </p>
      </section>
    </div>
  );
}
