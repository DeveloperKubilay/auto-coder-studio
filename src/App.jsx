import { useState } from 'react';
import { Files, Code, Brain, Globe, Settings, Terminal } from 'lucide-react';
import AI from './ai/index.jsx';
import FilesComponent from './files/index.jsx';
import CodeComponent from './code/index.jsx';
import WebComponent from './web/index.jsx';
import SettingsComponent from './settings/index.jsx';

function App() {
  const [activeTab, setActiveTab] = useState('Files');

  const tabs = [
    { icon: <Files size={24} />, label: 'Files', component: <FilesComponent /> },
    { icon: <Code size={24} />, label: 'Code', component: <CodeComponent /> },
    { icon: <Brain size={24} />, label: 'AI', component: <AI /> },
    { icon: <Terminal size={24} />, label: 'Terminal', component: <div>Burası Terminal kısmı</div> },
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
          padding: '20px', 
          minHeight: 'calc(100vh - 60px)', 
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
