import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/pages/MainPage';
import MatchPage from './components/pages/MatchPage';
import { AppProvider } from './components/AppContext';

function App() {

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/match-details/:id" element={<MatchPage />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App
