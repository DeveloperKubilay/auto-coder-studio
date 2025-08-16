import { useState, useEffect } from 'react';
import { Files, Code, Brain, Globe, Settings, Terminal } from 'lucide-react';
import AI from './ai/index.jsx';
import FilesComponent from './files/index.jsx';
import CodeComponent from './code/index.jsx';
import WebComponent from './web/index.jsx';
import SettingsComponent from './settings/index.jsx';
import TerminalComponent from './terminal/index.jsx';
import Projects from './Project/Projects.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('Files');
  const [currentProject, setCurrentProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectName = localStorage.getItem('projectName');
    setCurrentProject(projectName);
    setLoading(false);
  }, []);

  const handleProjectSelect = (projectName) => {
    setCurrentProject(projectName);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-white text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return <Projects onProjectSelect={handleProjectSelect} />;
  }

  const tabs = [
    { icon: <Files size={24} />, label: 'Files', component: <FilesComponent /> },
    { icon: <Code size={24} />, label: 'Code', component: <CodeComponent /> },
    { icon: <Brain size={24} />, label: 'AI', component: <AI /> },
    { icon: <Terminal size={24} />, label: 'Terminal', component: <TerminalComponent /> },
    { icon: <Globe size={24} />, label: 'Web', component: <WebComponent /> },
    { icon: <Settings size={24} />, label: 'Settings', component: <SettingsComponent /> }
  ];

  const activeContent = tabs.find(tab => tab.label === activeTab)?.component;

  const handleTouchStart = (e) => {
    const touchStartX = e.touches[0].clientX;
    e.target.touchStartX = touchStartX;
  };

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchStartX = e.target.touchStartX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        const currentIndex = tabs.findIndex(tab => tab.label === activeTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        setActiveTab(tabs[nextIndex].label);
      } else {
        const currentIndex = tabs.findIndex(tab => tab.label === activeTab);
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        setActiveTab(tabs[prevIndex].label);
      }
    }
  };

  return (
    <>
      <div
        style={{ 
          padding: '0', 
          minHeight: '100vh', 
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {activeContent}
      </div>
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-around', background: '#f8f9fa', padding: '10px 0', borderTop: '1px solid #ddd', zIndex: 1000 }}>
        {tabs.map(({ icon, label }) => (
          <div
            key={label}
            onClick={() => setActiveTab(label)}
            style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', color: activeTab === label ? 'blue' : 'black' }}
          >
            {icon}
            <p style={{ margin: 0, fontSize: '12px' }}>{label}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
