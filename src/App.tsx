// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntryPage from './components/EntryPage';
import GameReport from './components/GameReport';
import Test from './components/Test';

const App: React.FC = () => {
  return (
    <Router basename='/ai-report-demo'>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Routes>
          <Route path="/" element={<EntryPage />} />
          <Route path="/report/:playerId" element={<GameReport />} />
          <Route path='/3d' element={<Test/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
