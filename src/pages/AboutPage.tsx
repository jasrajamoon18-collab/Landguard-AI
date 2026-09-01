import { Info, Cpu, Database, ArrowDown, Server, GitBranch, Layers, Shield } from "lucide-react";

export function AboutPage() {
  const workflow = [
    "Data Collection",
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
  ];

  const techStack = ["React", "TypeScript", "Vite", "Tailwind CSS", "Leaflet", "OpenStreetMap", "Recharts", "Lucide React"];

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
          LANDGUARD AI combines environmental indicators — rainfall, soil moisture, slope angle, ground movement,
          elevation, and historical landslide patterns — to estimate landslide risk and visualize vulnerable locations
          on an interactive GIS map. The system produces a transparent risk score from 0–100 and provides explainable
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
          environmental datasets.
        </p>
        <div className="flex flex-wrap gap-2">
          {["Random Forest", "XGBoost", "Historical Datasets", "Real Sensor Networks"].map((item) => (
            <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-sm text-slate-300">
              <GitBranch size={14} className="text-slate-500" /> {item}
            </span>
          ))}
        </div>
      </section>

      {/* Future API */}
      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Server size={20} className="text-cyan-400" /> Future API Structure
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          The project is structured for future backend integration. The service layer (<code className="text-cyan-400 text-xs bg-slate-800 px-1.5 py-0.5 rounded">src/services/api.ts</code>)
          currently returns local demo data but can be connected to real API endpoints:
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
          <Shield size={20} /> Demo & Disclaimer
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          This is a prototype for demonstration purposes. All data is simulated. The AI risk engine is a transparent
          weighted model — not a scientifically validated ML model. This system is NOT intended for real-world
          emergency decisions. Always follow instructions from official disaster management authorities.
        </p>
      </section>
    </div>
  );
}
