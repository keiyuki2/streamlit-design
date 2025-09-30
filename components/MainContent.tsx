
import React, { useState, useEffect, useRef } from 'react';
import ProgressBar from './ProgressBar';
import LineChart from './LineChart';
import ToggleSwitch from './ToggleSwitch';
import { ChainIcon } from './icons/ChainIcon';
import { MoreIcon } from './icons/MoreIcon';

interface MainContentProps {
  totalTimesteps: number;
}

// A new sub-component for the stat cards
const StatCard: React.FC<{title: string; value: string; trend?: 'up' | 'down'; chartData?: number[]}> = ({ title, value, trend, chartData }) => (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm p-6 flex flex-col">
        <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h4>
            {trend && (
                <span className={`text-sm font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {trend === 'up' ? '▲' : '▼'}
                </span>
            )}
        </div>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">{value}</p>
        <div className="flex-grow">
            {chartData && chartData.length > 1 ? <LineChart data={chartData}/> : <div className="h-[160px]"></div>}
        </div>
    </div>
);

const MainContent: React.FC<MainContentProps> = ({ totalTimesteps }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [rewardHistory, setRewardHistory] = useState<number[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [averageReward, setAverageReward] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWideMode, setIsWideMode] = useState(false);
  const [runOnSave, setRunOnSave] = useState(true);
  const settingsRef = useRef<HTMLDivElement>(null);

  // FIX: Replaced NodeJS.Timeout with inferred type from setInterval and improved effect logic for browser compatibility.
  useEffect(() => {
    if (isTraining) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isTraining]);

  // FIX: Replaced NodeJS.Timeout with inferred type from setInterval and improved effect logic for browser compatibility.
  useEffect(() => {
    if (isTraining && currentStep < totalTimesteps) {
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          const nextStep = prev + Math.floor(totalTimesteps / 200);
          if (nextStep >= totalTimesteps) {
            setIsTraining(false);
            return totalTimesteps;
          }
          return nextStep;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isTraining, currentStep, totalTimesteps]);

  useEffect(() => {
    // Reset when totalTimesteps changes
    setCurrentStep(0);
    setRewardHistory([]);
    setAverageReward(0);
    setIsTraining(false);
    setElapsedTime(0);
  }, [totalTimesteps]);

  useEffect(() => {
    // Simulate reward data
    if (currentStep > 0 && isTraining) {
      const newReward = Math.random() * 50 + Math.log(currentStep / 1000 + 1) * 20;
      setRewardHistory(prev => [...prev.slice(-99), newReward]);
      setAverageReward(prev => (prev * (rewardHistory.length) + newReward) / (rewardHistory.length + 1));
    }
  }, [currentStep, isTraining]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className={`mx-auto transition-all duration-300 ${isWideMode ? 'max-w-full' : 'max-w-7xl'}`}>
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Training Progress</h1>
            <p className="text-slate-500 dark:text-slate-400">PPO_cartpole-v1_0</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              View Logs
            </button>
            <button 
              onClick={() => setIsTraining(!isTraining)}
              className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors ${
                isTraining
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isTraining ? 'Stop Training' : 'Start Training'}
            </button>
          </div>
        </header>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Timestep {currentStep.toLocaleString()} / {totalTimesteps.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-indigo-500 dark:text-indigo-400">
              {isTraining ? 'Running...' : 'Paused'}
            </span>
          </div>
          <ProgressBar value={currentStep} max={totalTimesteps} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Average Reward" value={averageReward.toFixed(2)} chartData={rewardHistory} />
          <StatCard title="Loss" value="0.0123" trend="down" />
          <StatCard title="Learning Rate" value="2.5e-4" />
          <StatCard title="Time Elapsed" value={formatTime(elapsedTime)} />
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Reward History</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Smoothed reward over the last 100 episodes.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">Sync</span>
                      <ToggleSwitch id="sync-toggle" checked={true} onChange={() => {}} />
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <ChainIcon className="w-5 h-5" />
                  </button>
                   <div className="relative" ref={settingsRef}>
                      <button 
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        aria-label="Open settings menu"
                      >
                          <MoreIcon className="w-5 h-5" />
                      </button>
                      {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-10 p-4">
                          <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-4">Settings</h3>
                          
                          <h4 className="font-semibold text-slate-600 dark:text-slate-400 text-sm mb-2">Development</h4>
                          <div className="flex justify-between items-center mb-4">
                              <div>
                                  <p className="text-slate-800 dark:text-slate-200">Run on save</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                      Auto-update the app on code changes.
                                  </p>
                              </div>
                              <ToggleSwitch id="run-on-save" checked={runOnSave} onChange={setRunOnSave} />
                          </div>

                          <h4 className="font-semibold text-slate-600 dark:text-slate-400 text-sm mb-2">Appearance</h4>
                          <div className="flex justify-between items-center mb-4">
                              <div>
                                  <p className="text-slate-800 dark:text-slate-200">Wide mode</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                      Occupy the entire width of the screen.
                                  </p>
                              </div>
                              <ToggleSwitch id="wide-mode" checked={isWideMode} onChange={setIsWideMode} />
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Choose app theme</p>
                          <button className="w-full text-left p-2 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                              Light
                          </button>
                      </div>
                      )}
                   </div>
                </div>
            </div>
            <LineChart data={rewardHistory} />
        </div>
      </div>
    </main>
  );
};

export default MainContent;