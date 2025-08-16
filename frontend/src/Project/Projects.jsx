import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Folder, ExternalLink } from 'lucide-react';
import CreateProject from './CreateProject';

function Projects({ onProjectSelect }) {
  const [projects, setProjects] = useState([]);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:3000/projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Projeler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectCreated = (projectName) => {
    setShowCreateProject(false);
    fetchProjects();
    if (projectName) {
      localStorage.setItem('projectName', projectName);
      onProjectSelect(projectName);
    }
  };

  const selectProject = (projectName) => {
    localStorage.setItem('projectName', projectName);
    onProjectSelect(projectName);
  };

  if (showCreateProject) {
    return <CreateProject onBack={() => setShowCreateProject(false)} onProjectCreated={handleProjectCreated} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <motion.h1 
          className="text-5xl font-bold text-white mb-2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Auto Coder Studio
        </motion.h1>
        
        <motion.p 
          className="text-purple-300 text-center mb-12 text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Projenizi seçin veya yeni bir proje oluşturun
        </motion.p>

        <motion.button
          onClick={() => setShowCreateProject(true)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                     text-white font-semibold py-6 px-8 rounded-2xl shadow-2xl mb-8 
                     transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Plus size={28} />
          <span className="text-xl">Yeni Proje Oluştur</span>
        </motion.button>

        {loading ? (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <p className="text-white mt-4">Projeler yükleniyor...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {projects.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold text-white mb-6">Mevcut Projeler</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => selectProject(project)}
                      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 cursor-pointer 
                                 hover:bg-white/20 transition-all duration-300 shadow-xl
                                 border border-white/20 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-500/30 p-3 rounded-lg group-hover:bg-purple-500/50 transition-colors">
                          <Folder size={24} className="text-purple-300" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg">{project}</h3>
                          <p className="text-purple-300 text-sm">Projeyi aç</p>
                        </div>
                        <ExternalLink size={18} className="text-purple-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <motion.div 
                className="text-center text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="bg-white/5 rounded-2xl p-12 border border-white/10">
                  <Folder size={64} className="mx-auto text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Henüz proje yok</h3>
                  <p className="text-purple-300">İlk projenizi oluşturmak için yukarıdaki butona tıklayın</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Projects;
