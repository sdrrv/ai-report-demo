// App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import EntryPage from './components/EntryPage';
import GameReport from './components/GameReport';
import Test from './components/Test';
import { FileText, Zap } from 'lucide-react';

function Base() {
  const navigateHook = useNavigate();
  const navigate = (path: string) => {
    navigateHook(path);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">
            Matchlytics demos
          </h1>
          <p className="text-slate-600">Choose your demo</p>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          {/* AI Report Button */}
          <button
            onClick={() => navigate('/entry')}
            className="group relative w-full transform overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="rounded-lg bg-white/20 p-2 transition-colors duration-300 group-hover:bg-white/30">
                <FileText size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold">AI Report</h3>
                <p className="text-sm text-blue-100">Detailed game analysis</p>
              </div>
            </div>

            {/* Animated background effect */}
            <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></div>
          </button>

          {/* Ball Trajectory 3D Button */}
          <button
            onClick={() => navigate('/3d')}
            className="group relative w-full transform overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="rounded-lg bg-white/20 p-2 transition-colors duration-300 group-hover:bg-white/30">
                <Zap size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-semibold">Ball Trajectory 3D</h3>
                <p className="text-sm text-emerald-100">
                  Interactive 3D visualization (DEMO)
                </p>
              </div>
            </div>

            {/* Animated background effect */}
            <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"></div>
          </button>
        </div>

        {/* Footer */}
        <div className="pt-8 text-center">
          <p className="text-sm text-slate-500">Select an option to continue</p>
        </div>
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <Router basename="/ai-report-demo">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Routes>
          <Route path="/" element={<Base />} />
          <Route path="/entry" element={<EntryPage />} />
          <Route path="/report/:playerId" element={<GameReport />} />
          <Route path="/3d" element={<Test />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
