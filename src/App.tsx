import { useState, useMemo } from "react";
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
import { locations } from "@/data/locations";
import type { PageId, Language } from "@/types";

function App() {
  const [page, setPage] = useState<PageId>("dashboard");
  const [language, setLanguage] = useState<Language>("en");
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);

  const regionScore = useMemo(() => {
    return Math.round(locations.reduce((s, l) => s + l.riskScore, 0) / locations.length);
  }, []);

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
    >
      {page === "dashboard" && (
        <Dashboard
          onNavigate={handleNavigate}
          onSelectLocation={handleSelectLocation}
          language={language}
          regionScore={regionScore}
        />
      )}
      {page === "map" && <MapPage onSelectLocation={handleSelectLocation} />}
      {page === "prediction" && (
        <PredictionPanel
          preselectedLocationId={selectedLocationId}
          language={language}
        />
      )}
      {page === "monitoring" && <LiveMonitoring language={language} />}
      {page === "alerts" && (
        <AlertsPage
          onNavigate={handleNavigate}
          onSelectLocation={handleSelectLocation}
          language={language}
        />
      )}
      {page === "locations" && <LocationsPage onSelectLocation={handleSelectLocation} />}
      {page === "analytics" && <AnalyticsPage />}
      {page === "emergency" && (
        <EmergencyResponse
          onNavigate={handleNavigate}
          onSelectLocation={handleSelectLocation}
        />
      )}
      {page === "about" && <AboutPage />}

      <AIAssistant regionScore={regionScore} />
    </Layout>
  );
}

export default App;
