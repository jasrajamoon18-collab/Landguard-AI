import { useState } from "react";
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
import { useLocations } from "@/hooks/useLocations";
import type { PageId, Language } from "@/types";

function App() {
  const [page, setPage] = useState<PageId>("dashboard");
  const [language, setLanguage] = useState<Language>("en");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

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

  const handleNavigate = (p: PageId) => {
    setPage(p);
  };

  const handleSelectLocation = (id: string) => {
    setSelectedLocationId(id);
    setPage("prediction");
  };

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

      <AIAssistant regionScore={regionScore} />
    </Layout>
  );
}

export default App;
