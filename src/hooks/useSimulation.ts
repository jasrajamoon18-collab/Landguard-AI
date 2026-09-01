import { useState, useRef, useCallback, useEffect } from "react";
import type { SensorData, RiskLevel } from "@/types";
import { classifyRisk } from "@/utils/risk";

interface SimStage {
  name: string;
  rainfall: number;
  soilMoisture: number;
  groundMovement: number;
  riskScore: number;
  weather: string;
  temperature: number;
}

const STAGES: SimStage[] = [
  { name: "NORMAL CONDITIONS", rainfall: 35, soilMoisture: 42, groundMovement: 1, riskScore: 28, weather: "Light Rain", temperature: 26 },
  { name: "RISK INCREASING", rainfall: 90, soilMoisture: 67, groundMovement: 4, riskScore: 54, weather: "Moderate Rain", temperature: 23 },
  { name: "CRITICAL CONDITIONS", rainfall: 150, soilMoisture: 88, groundMovement: 9, riskScore: 87, weather: "Heavy Rain", temperature: 21 },
];

export function useSimulation() {
  const [isRunning, setIsRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0-1 within current stage
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historyRef = useRef<{ time: string; rainfall: number; soilMoisture: number; groundMovement: number; riskScore: number }[]>([]);

  const current = STAGES[stageIndex];
  const nextStage = STAGES[Math.min(stageIndex + 1, STAGES.length - 1)];

  // Interpolate between current stage and next stage based on progress
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const liveData: SensorData = {
    rainfall: Math.round(lerp(current.rainfall, nextStage.rainfall, progress)),
    soilMoisture: Math.round(lerp(current.soilMoisture, nextStage.soilMoisture, progress)),
    groundMovement: +lerp(current.groundMovement, nextStage.groundMovement, progress).toFixed(1),
    temperature: Math.round(lerp(current.temperature, nextStage.temperature, progress)),
    weather: progress > 0.5 && stageIndex < STAGES.length - 1 ? nextStage.weather : current.weather,
    riskScore: Math.round(lerp(current.riskScore, nextStage.riskScore, progress)),
    riskLevel: classifyRisk(Math.round(lerp(current.riskScore, nextStage.riskScore, progress))),
    timestamp: new Date().toISOString(),
  };

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const tick = useCallback(() => {
    setProgress((p) => {
      const np = p + 0.02; // 50 ticks per stage
      if (np >= 1) {
        setStageIndex((si) => {
          if (si >= STAGES.length - 1) {
            stop();
            return si;
          }
          return si + 1;
        });
        return 0;
      }
      return np;
    });
  }, [stop]);

  const start = useCallback(() => {
    if (stageIndex >= STAGES.length - 1 && progress >= 1) {
      // Reset if at end
      setStageIndex(0);
      setProgress(0);
    }
    setIsRunning(true);
  }, [stageIndex, progress]);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(tick, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, tick]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    stop();
    setStageIndex(0);
    setProgress(0);
  }, [stop]);

  // Record history
  useEffect(() => {
    const point = {
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      rainfall: liveData.rainfall,
      soilMoisture: liveData.soilMoisture,
      groundMovement: liveData.groundMovement,
      riskScore: liveData.riskScore,
    };
    historyRef.current = [...historyRef.current.slice(-29), point];
  }, [liveData.rainfall, liveData.soilMoisture, liveData.groundMovement, liveData.riskScore]);

  const stageName = current.name;
  const isComplete = stageIndex >= STAGES.length - 1 && progress >= 0.98 && !isRunning;

  return {
    isRunning,
    liveData,
    stageName,
    stageIndex,
    progress,
    history: historyRef.current,
    start,
    pause,
    reset,
    isComplete,
    stageCount: STAGES.length,
  };
}

export type { SimStage };
