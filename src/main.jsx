import { createRoot } from 'react-dom/client'
import '../index.css' // Corrected the path to index.css
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <App />
)
