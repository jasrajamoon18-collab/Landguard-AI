import { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { AIAssistant } from "@/components/AIAssistant";
import { Dashboard } from "@/pages/Dashboard";
import { MapPage } from "@/pages/MapPage";
import { PredictionPanel } from "@/pages/PredictionPanel";
import { LiveMonitoring } from "@/pages/LiveMonitoring";
import { AlertsPage } from "@/pages/AlertsPage";
import { LocationsPage } from "@/pages/LocationsPage";
import { AnalyticsPage } from "@/pages/AnalyticsPage";
import { EmergencyResponse } from "@/pages/EmergencyResponse";
import { AboutPage } from "@/pages/AboutPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { MyAlerts } from "@/pages/MyAlerts";
import { AlertSettings } from "@/pages/AlertSettings";
import { AlertHistoryPage } from "@/pages/AlertHistoryPage";
import { EmergencyInfoPage } from "@/pages/EmergencyInfoPage";
import { AdminPage } from "@/pages/AdminPage";
import { useLocations } from "@/hooks/useLocations";
import { useAlertEngine } from "@/hooks/useAlertEngine";
import type { PageId, Language } from "@/types";
import type { AlertTriggerResult } from "@/services/alertEngineService";

function App() {
  const [page, setPage] = useState<PageId>("dashboard");
  const [language, setLanguage] = useState<Language>("en");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [lastAlert, setLastAlert] = useState<AlertTriggerResult | null>(null);

  const {
    locations,
    alerts,
    loading,
    error,
    dataStatus,
    lastRefresh,
    regionScore,
    isSimulating,
    imergConfigured,
    refresh,
    updateLocations,
    setSimulationMode,
  } = useLocations();

  useAlertEngine({
    locations,
    dataStatus,
    enabled: true,
    onAlert: (result) => setLastAlert(result),
  });

  const handleNavigate = (p: PageId) => {
    setPage(p);
  };

  const handleSelectLocation = (id: string) => {
    setSelectedLocationId(id);
    setPage("prediction");
  };

  const handleSimulateEscalation = useCallback(
    async (targetLevel: "MODERATE" | "HIGH" | "CRITICAL") => {
      const { getLocalRegistration } = await import("@/services/userPreferencesService");
      const { shouldTriggerAlert, triggerAlert } = await import("@/services/alertEngineService");
      const registration = getLocalRegistration();
      if (!registration || locations.length === 0) return;

      const loc = locations[0];
      const simulatedLoc = {
        ...loc,
        riskLevel: targetLevel,
        riskScore: targetLevel === "CRITICAL" ? 88 : targetLevel === "HIGH" ? 72 : 45,
      };

      const { shouldTrigger } = shouldTriggerAlert(registration, simulatedLoc);
      if (shouldTrigger) {
        const result = await triggerAlert(registration, simulatedLoc, true);
        setLastAlert(result);
      }
    },
    [locations],
  );

  return (
    <Layout
      currentPage={page}
      onNavigate={handleNavigate}
      language={language}
      onLanguageChange={setLanguage}
      regionScore={regionScore}
      dataStatus={dataStatus}
      onRefresh={refresh}
      loading={loading}
      lastRefresh={lastRefresh}
      error={error}
    >
      {page === "dashboard" && (
        <Dashboard
          onNavigate={handleNavigate}
          onSelectLocation={handleSelectLocation}
          language={language}
          regionScore={regionScore}
          locations={locations}
          dataStatus={dataStatus}
          onRefresh={refresh}
          loading={loading}
        />
      )}
      {page === "map" && (
        <MapPage
          locations={locations}
          onSelectLocation={handleSelectLocation}
          dataStatus={dataStatus}
        />
      )}
      {page === "prediction" && (
        <PredictionPanel
          preselectedLocationId={selectedLocationId}
          language={language}
          locations={locations}
        />
      )}
      {page === "monitoring" && (
        <LiveMonitoring
          language={language}
          locations={locations}
          dataStatus={dataStatus}
          onRefresh={refresh}
          loading={loading}
          onUpdateLocations={updateLocations}
          onSetSimulationMode={setSimulationMode}
        />
      )}
      {page === "alerts" && (
        <AlertsPage
          onNavigate={handleNavigate}
          onSelectLocation={handleSelectLocation}
          language={language}
          alerts={alerts}
        />
      )}
      {page === "locations" && (
        <LocationsPage
          locations={locations}
          onSelectLocation={handleSelectLocation}
        />
      )}
      {page === "analytics" && (
        <AnalyticsPage locations={locations} alerts={alerts} />
      )}
      {page === "emergency" && (
        <EmergencyResponse
          onNavigate={handleNavigate}
          onSelectLocation={handleSelectLocation}
          locations={locations}
        />
      )}
      {page === "about" && <AboutPage />}

      {/* New pages */}
      {page === "register" && (
        <RegisterPage
          locations={locations}
          onRegistered={() => {}}
          onNavigate={handleNavigate}
        />
      )}
      {page === "myalerts" && (
        <MyAlerts
          locations={locations}
          dataStatus={dataStatus}
          lastRefresh={lastRefresh}
          onNavigate={handleNavigate}
        />
      )}
      {page === "alert-settings" && (
        <AlertSettings onNavigate={handleNavigate} />
      )}
      {page === "alert-history" && <AlertHistoryPage />}
      {page === "emergency-info" && <EmergencyInfoPage />}
      {page === "admin" && (
        <AdminPage
          locations={locations}
          dataStatus={dataStatus}
          lastRefresh={lastRefresh}
        />
      )}

      {/* Demo alert banner */}
      {lastAlert && (
        <DemoAlertBanner
          result={lastAlert}
          onDismiss={() => setLastAlert(null)}
        />
      )}

      <AIAssistant regionScore={regionScore} />

      {/* Demo simulation control (floating) */}
      <DemoSimulationControl
        onSimulate={handleSimulateEscalation}
      />
    </Layout>
  );
}

function DemoAlertBanner({
  result,
  onDismiss,
}: {
  result: AlertTriggerResult;
  onDismiss: () => void;
}) {
  const color = result.alertLevel === "CRITICAL" ? "#ef4444" : result.alertLevel === "HIGH" ? "#f97316" : "#eab308";
  return (
    <div
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 rounded-xl border-2 p-4 shadow-2xl backdrop-blur-md"
      style={{ borderColor: color + "60", backgroundColor: "#0f172add" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 text-white font-bold"
          style={{ backgroundColor: color }}
        >
          {result.riskScore}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold flex items-center gap-2" style={{ color }}>
            {result.isDemo && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">
                DEMO
              </span>
            )}
            {result.alertLevel === "CRITICAL" ? "EMERGENCY ALERT" : "WARNING"}
          </div>
          <div className="text-xs text-slate-400 mt-1">{result.locationName}</div>
          <div className="text-xs text-slate-500 mt-1">{result.reason}</div>
          {result.smsResult && result.smsResult.isDemo && (
            <div className="mt-2 p-2 rounded bg-slate-800/60 text-[10px] text-yellow-400 font-mono whitespace-pre-wrap">
              [DEMO SMS] To: {result.smsResult.recipient}
              {"\n"}{result.smsResult.body}
            </div>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-500 hover:text-slate-300 text-xs shrink-0"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

function DemoSimulationControl({
  onSimulate,
}: {
  onSimulate: (level: "MODERATE" | "HIGH" | "CRITICAL") => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-4 left-4 z-40">
      {open && (
        <div className="mb-2 rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-md p-3 shadow-xl">
          <div className="text-xs font-semibold text-slate-300 mb-2">Simulate Risk Escalation</div>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => { onSimulate("MODERATE"); setOpen(false); }}
              className="px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium hover:bg-yellow-500/20 transition-colors text-left"
            >
              MODERATE → HIGH
            </button>
            <button
              onClick={() => { onSimulate("HIGH"); setOpen(false); }}
              className="px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium hover:bg-orange-500/20 transition-colors text-left"
            >
              HIGH → CRITICAL
            </button>
            <button
              onClick={() => { onSimulate("CRITICAL"); setOpen(false); }}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors text-left"
            >
              Trigger CRITICAL
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-medium text-slate-400 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        DEMO MODE
      </button>
    </div>
  );
}

export default App;
