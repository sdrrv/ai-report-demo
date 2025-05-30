import React, { useState } from 'react';
import EntryPage from './components/EntryPage';
import GameReport from './components/GameReport';

const App: React.FC = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  const handlePlayerSelect = (playerId: number) => {
    setSelectedPlayer(playerId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {selectedPlayer === null ? (
        <EntryPage onPlayerSelect={handlePlayerSelect} />
      ) : (
        <GameReport selectedPlayer={selectedPlayer} />
      )}
    </div>
  );
};

export default App;
