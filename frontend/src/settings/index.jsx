import { useState } from 'react';

export default function Settings() {
  const [currentProject, setCurrentProject] = useState(
    localStorage.getItem('projectName') || 'Proje Seçin'
  );

  return (
    <div>
      <div className="flex items-center justify-between bg-slate-800 px-4 py-2 border-b border-slate-700 w-full">
        <h2 className="text-white font-semibold">Proje: {currentProject}</h2>
        <button
          onClick={() => {
            localStorage.removeItem('projectName');
            setCurrentProject(null);
          }}
          className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
        >
          Proje Değiştir
        </button>
      </div>
    </div>
  );
}