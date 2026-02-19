import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './Pages/Home';
import Dashboard from './Pages/Dashboard';
import About from './Pages/About';
import GeneLibrary from './Pages/GeneLibrary';
import ClinicalLogs from './Pages/ClinicalLogs';
import Security from './Pages/Security';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/about" element={<About />} />
  <Route path="/library" element={<GeneLibrary />} />
  <Route path="/logs" element={<ClinicalLogs />} />
  <Route path="/security" element={<Security />} />
</Routes>
    </Router>
  );
}
export default App;