export interface Shot {
  x: number;
  y: number;
  type:
    | 'forehand'
    | 'backhand'
    | 'forehandVolley'
    | 'backhandVolley'
    | 'serve'
    | 'overhead';
  result: 'hit' | 'bounce';
  team: 'yours' | 'opponent';
}

export interface GameData {
  offensive: number;
  defensive: number;
  teamHits: number;
  yourWinners: number;
  teammateWinners: number;
  opponentLeftWinners: number;
  opponentRightWinners: number;
}

export interface Player {
  id: number;
  name: string;
  position: string;
}
