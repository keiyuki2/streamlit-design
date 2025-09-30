import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';

export type Theme = 'dark' | 'light';

function App() {
  const [totalTimesteps, setTotalTimesteps] = useState(1000000);
  const [theme, setTheme] = useState<Theme>('dark');

  return (
    <div className={`${theme} h-screen w-screen overflow-hidden antialiased flex bg-slate-100 dark:bg-slate-900 transition-colors duration-300`}>
      <Sidebar 
        totalTimesteps={totalTimesteps}
        setTotalTimesteps={setTotalTimesteps}
        theme={theme}
        setTheme={setTheme}
      />
      <MainContent totalTimesteps={totalTimesteps} />
    </div>
  );
}

export default App;