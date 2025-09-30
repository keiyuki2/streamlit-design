import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  showSlider?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, max, showSlider = false }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 relative">
      <div
        className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
      {showSlider && (
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full shadow-md cursor-pointer border-2 border-indigo-500 focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800"
          style={{ left: `${percentage}%` }}
          role="slider"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        ></div>
      )}
    </div>
  );
};

export default ProgressBar;