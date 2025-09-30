import React from 'react';

interface LineChartProps {
  data: number[];
  yMin?: number;
  yMax?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, yMin, yMax }) => {
  if (!data || data.length < 2) {
    return (
        <div className="flex items-center justify-center h-40 text-slate-500 dark:text-slate-400">
            <p>Not enough data to display chart.</p>
        </div>
    );
  }

  const svgWidth = 300;
  const svgHeight = 100;
  const yPadding = 15;
  const xPadding = 5;

  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  const dataRange = dataMax - dataMin;

  // Determine the final min and max for the Y-axis.
  // If manual limits are not set, add a 10% buffer to the data range.
  // If all data points are the same, add a small absolute buffer.
  const finalMin = yMin ?? (dataRange === 0 ? dataMin - 1 : dataMin - dataRange * 0.1);
  const finalMax = yMax ?? (dataRange === 0 ? dataMax + 1 : dataMax + dataRange * 0.1);
  
  const displayRange = finalMax - finalMin === 0 ? 1 : finalMax - finalMin;

  const points = data
    .map((d, i) => {
      const x = xPadding + (i / (data.length - 1)) * (svgWidth - 2 * xPadding);
      // Clamp the data point to stay within the visible y-axis range
      const clampedValue = Math.max(finalMin, Math.min(finalMax, d));
      const y = (svgHeight - yPadding) - ((clampedValue - finalMin) / displayRange) * (svgHeight - 2 * yPadding);
      return `${x},${y}`;
    })
    .join(' ');
    
  const areaPath = `M${points.split(' ')[0]} L ${points} L ${xPadding + (svgWidth - 2 * xPadding)},${svgHeight} L ${xPadding},${svgHeight} Z`;

  return (
    <div className="h-40 -mx-2 -mb-2">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-indigo-500)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--color-indigo-500)" stopOpacity="0" />
                </linearGradient>
                {/* A small hack to get Tailwind colors into SVG defs */}
                <style>
                    {`
                        :root { --color-indigo-500: #6366f1; }
                    `}
                </style>
            </defs>
             {/* Grid lines */}
            {[...Array(3)].map((_, i) => (
                <line
                    key={i}
                    x1={xPadding}
                    y1={(svgHeight / 4) * (i + 1)}
                    x2={svgWidth - xPadding}
                    y2={(svgHeight / 4) * (i + 1)}
                    className="stroke-slate-200 dark:stroke-slate-700/50"
                    strokeWidth="0.5"
                />
            ))}
             {/* Area Gradient */}
             <path d={areaPath} fill="url(#areaGradient)" />
            {/* Line */}
            <polyline
                fill="none"
                className="stroke-indigo-500"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
        </svg>
    </div>
  );
};

export default LineChart;