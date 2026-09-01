import { Play, Pause, RotateCcw } from "lucide-react";
import { t } from "@/data/translations";
import type { Language } from "@/types";

interface SimulationControllerProps {
  isRunning: boolean;
  stageName: string;
  stageIndex: number;
  stageCount: number;
  progress: number;
  isComplete: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  language: Language;
}

export function SimulationController({
  isRunning,
  stageName,
  stageIndex,
  stageCount,
  progress,
  isComplete,
  onStart,
  onPause,
  onReset,
  language,
}: SimulationControllerProps) {
  const overallProgress = ((stageIndex + progress) / stageCount) * 100;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Landslide Simulation</h3>
          <p className="text-xs text-slate-500 mt-0.5">Watch risk escalate as environmental conditions worsen</p>
        </div>
        <div className="flex gap-2">
          {!isRunning ? (
            <button
              onClick={onStart}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              <Play size={16} />
              {isComplete ? "Restart" : t(language, "startSimulation").replace("Start Landslide ", "")}
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm transition-colors"
            >
              <Pause size={16} /> {t(language, "pauseSimulation").replace("Simulation", "")}
            </button>
          )}
          <button
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-cyan-400 tracking-wide">{stageName}</span>
          <span className="text-slate-500">Stage {stageIndex + 1} / {stageCount}</span>
        </div>
        <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500 transition-all duration-200"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
