import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Rocket, Code } from 'lucide-react';

function CreateProject({ onBack, onProjectCreated }) {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      console.log('Templates fetch ediliyor...');
      const response = await fetch('http://localhost:3000/templates');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Templates data:', data);
      setTemplates(data);
    } catch (error) {
      console.error('Template\'ler yüklenirken hata:', error);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !projectType) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/createProject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ProjectName: projectName.trim(),
          template: projectType
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onProjectCreated(data.projectName);
      } else {
        const error = await response.json();
        alert('Hata: ' + error.error);
      }
    } catch (error) {
      console.error('Proje oluşturulurken hata:', error);
      alert('Proje oluşturulurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getTemplateIcon = (template) => {
    switch (template) {
      case 'nodejs':
        return <Code className="text-green-400" size={20} />;
      default:
        return <Rocket className="text-blue-400" size={20} />;
    }
  };

  const getTemplateDescription = (template) => {
    switch (template) {
      case 'nodejs':
        return 'Node.js projesi oluştur';
      default:
        return `${template} projesi oluştur`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-2xl mx-auto"
      >
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-300 hover:text-white mb-8 transition-colors"
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={20} />
          <span>Geri Dön</span>
        </motion.button>

        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Sparkles size={32} className="text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Yeni Proje Oluştur</h1>
            <p className="text-purple-300">Harika bir proje yaratmaya hazır mısın?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-white font-semibold mb-3">
                Proje Adı
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Proje adını girin..."
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white 
                           placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 
                           focus:border-transparent transition-all duration-300"
                required
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-white font-semibold mb-3">
                Proje Tipi
              </label>
              {templatesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  <span className="text-purple-300 ml-3">Template'ler yükleniyor...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <motion.label
                      key={template}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all duration-300 ${
                        projectType === template
                          ? 'bg-purple-500/20 border-purple-500 text-white'
                          : 'bg-white/5 border-white/20 text-purple-200 hover:bg-white/10 hover:border-white/30'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * templates.indexOf(template) }}
                    >
                      <input
                        type="radio"
                        name="projectType"
                        value={template}
                        checked={projectType === template}
                        onChange={(e) => setProjectType(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 flex-1">
                        {getTemplateIcon(template)}
                        <div>
                          <div className="font-semibold capitalize">{template}</div>
                          <div className="text-sm opacity-75">{getTemplateDescription(template)}</div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        projectType === template 
                          ? 'bg-purple-500 border-purple-500' 
                          : 'border-white/40'
                      }`}>
                        {projectType === template && (
                          <motion.div
                            className="w-full h-full rounded-full bg-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 0.5 }}
                            transition={{ type: "spring" }}
                          />
                        )}
                      </div>
                    </motion.label>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={loading || !projectName.trim() || !projectType}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                         disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed
                         text-white font-semibold py-4 px-6 rounded-xl shadow-lg 
                         transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100
                         flex items-center justify-center gap-3"
              whileHover={{ scale: !loading && projectName.trim() && projectType ? 1.02 : 1 }}
              whileTap={{ scale: !loading && projectName.trim() && projectType ? 0.98 : 1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {loading ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Proje Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Rocket size={20} />
                  <span>Projeyi Oluştur</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default CreateProject;
