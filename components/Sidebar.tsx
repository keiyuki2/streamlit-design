import React from 'react';
import { Theme } from '../App';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface SidebarProps {
  totalTimesteps: number;
  setTotalTimesteps: React.Dispatch<React.SetStateAction<number>>;
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
}

const Sidebar: React.FC<SidebarProps> = ({ totalTimesteps, setTotalTimesteps, theme, setTheme }) => {
  const handleTimestepChange = (amount: number) => {
    setTotalTimesteps(prev => Math.max(0, prev + amount));
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <aside className="w-80 bg-white dark:bg-slate-800/50 text-slate-800 dark:text-slate-300 p-6 flex-shrink-0 flex flex-col space-y-8 border-r border-slate-200 dark:border-slate-700/50">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-500 dark:text-slate-400">Settings</h2>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>
      
      <div>
        <label htmlFor="timesteps" className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
          Total Timesteps
        </label>
        <div className="flex relative">
          <button
            onClick={() => handleTimestepChange(-100000)}
            className="absolute left-0 top-0 bottom-0 px-3 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200 rounded-l-md"
            aria-label="Decrease timesteps by 100,000"
          >
            -
          </button>
          <input
            type="number"
            id="timesteps"
            value={totalTimesteps}
            onChange={(e) => setTotalTimesteps(Number(e.target.value))}
            className="w-full bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            step="100000"
          />
          <button
            onClick={() => handleTimestepChange(100000)}
            className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-200 rounded-r-md"
            aria-label="Increase timesteps by 100,000"
          >
            +
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;