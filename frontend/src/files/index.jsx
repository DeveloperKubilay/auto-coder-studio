import { useState, useEffect } from 'react';
import { Folder, FileText, File } from 'lucide-react';

export default function Files() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState('projemmuq'); // Varsayılan proje ismi

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const response = await fetch('http://localhost:3000/project/tree'); // Backend URL'ini kontrol et
        if (!response.ok) {
          throw new Error('Failed to fetch project tree');
        }
        const text = await response.text();
        const treeArray = [];
        const stack = [];

        text.split('\n').forEach((line, index) => {
          if (index === 0) return; // İlk satırı atlıyoruz (en üst klasör)

          const depth = (line.match(/│/g) || []).length; // Derinliği hesapla
          const name = line.replace(/^[│\s]+|├── |└── /g, '').trim(); // İsim al
          const isFolder = !name.includes('.'); // Uzantısı yoksa klasör

          while (stack.length > depth) {
            stack.pop();
          }

          const fullPath = stack.length > 0 ? `${stack.join('/')}/${name}` : name; // Tam yolu oluştur

          if (isFolder) {
            stack.push(name); // Klasörse stack'e ekle
          }

          treeArray.push({
            name,
            fullPath,
            isFolder,
            depth
          });
        });

        setTree(treeArray);
      } catch (error) {
        console.error(error);
        setTree([{ name: 'Hata: Proje ağacı yüklenemedi.', isFolder: false, depth: 0 }]);
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, []);

  const handleFileClick = async (item) => {
    if (item.isFolder) return; // Klasörlere tıklanamaz

    try {
      const filePath = item.fullPath; // currentProject'i kaldırıyoruz çünkü fullPath zaten tam yolu içeriyor
      console.log('Requesting file:', filePath); // Log ekledim
      const response = await fetch(`http://localhost:3000/project/file?filePath=${encodeURIComponent(filePath)}`); // Tam dosya yolunu kullanıyoruz
      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }
      const data = await response.json();
      setSelectedFile(filePath);
      setFileContent(data.content);
      setIsEditing(true);
    } catch (error) {
      console.error(error);
      alert('Dosya içeriği yüklenemedi.');
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:3000/project/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: selectedFile, content: fileContent })
      });
      if (!response.ok) {
        throw new Error('Failed to save file');
      }
      alert('Dosya başarıyla kaydedildi!');
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      alert('Dosya kaydedilemedi.');
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (isEditing) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: '#4A4A4A', marginBottom: '20px' }}>Dosya Düzenle: {selectedFile}</h1>
        <textarea
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
          style={{ width: '100%', height: '300px', marginBottom: '20px', fontFamily: 'monospace', fontSize: '14px' }}
        />
        <button onClick={handleSave} style={{ padding: '10px 20px', background: '#007BFF', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Kaydet
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#4A4A4A', marginBottom: '20px' }}>Proje Ağacı</h1>
      <div style={{ background: '#F9F9F9', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
        {tree.map((item, index) => {
          if (!item.name) return null; // Boş isimli elemanları atlıyoruz
          return (
            <div
              key={index}
              onClick={() => handleFileClick(item)}
              style={{
                padding: '5px 10px',
                cursor: item.isFolder ? 'default' : 'pointer',
                color: item.isFolder ? '#007BFF' : '#333',
                fontWeight: item.isFolder ? 'bold' : 'normal',
                marginLeft: `${item.depth}em`, // Hiyerarşi için girinti
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {item.isFolder ? (
                <Folder size={16} style={{ marginRight: '5px' }} />
              ) : (
                <FileText size={16} style={{ marginRight: '5px' }} />
              )}
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}