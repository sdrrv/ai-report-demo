// constants.ts
import { Shot, ShotType, Player } from './types';

export const ANIMATION_DELAYS = {
  SHOTS_DELAY: 400,
  MODE_TRANSITION: 300,
  FILTER_TRANSITION: 200,
  TRANSITION_IN: 50,
  SHOT_STAGGER: 50,
} as const;

export const shotTypes: ShotType[] = [
  { id: 'forehand', label: 'Forehand' },
  { id: 'backhand', label: 'Backhand' },
  { id: 'forehandVolley', label: 'Forehand Volley' },
  { id: 'backhandVolley', label: 'Backhand Volley' },
  { id: 'serve', label: 'Serve' },
  { id: 'overhead', label: 'Overhead' },
];

export const players: Player[] = [
  { id: 1, position: 'Back Left' },
  { id: 2, position: 'Back Right' },
  { id: 3, position: 'Front Left' },
  { id: 4, position: 'Front Right' },
];

export const sampleShots: Shot[] = [
  // Forehand shots
  { x: 75, y: 25, type: 'forehand', result: 'interception' },
  { x: 25, y: 15, type: 'forehand', result: 'interception' },
  { x: 55, y: 20, type: 'forehand', result: 'interception' },
  { x: 65, y: 22, type: 'forehand', result: 'interception' },
  { x: 85, y: 21, type: 'forehand', result: 'interception' },
  { x: 55, y: 20, type: 'forehand', result: 'interception' },
  { x: 35, y: 19, type: 'forehand', result: 'interception' },
  { x: 80, y: 30, type: 'forehand', result: 'interception' },
  { x: 47, y: 16, type: 'forehand', result: 'interception' },

  { x: 75, y: 20, type: 'forehand', result: 'groundBounce' },
  { x: 70, y: 50, type: 'forehand', result: 'groundBounce' },
  { x: 15, y: 65, type: 'forehand', result: 'groundBounce' },
  { x: 30, y: 67, type: 'forehand', result: 'groundBounce' },
  { x: 45, y: 66, type: 'forehand', result: 'groundBounce' },
  { x: 60, y: 66, type: 'forehand', result: 'groundBounce' },
  { x: 75, y: 66, type: 'forehand', result: 'groundBounce' },
  { x: 20, y: 50, type: 'forehand', result: 'groundBounce' },
  { x: 40, y: 48, type: 'forehand', result: 'groundBounce' },
  { x: 60, y: 48, type: 'forehand', result: 'groundBounce' },
  { x: 75, y: 49, type: 'forehand', result: 'groundBounce' },
  { x: 85, y: 50, type: 'forehand', result: 'groundBounce' },
  { x: 33, y: 60, type: 'forehand', result: 'groundBounce' },
  { x: 25, y: 22, type: 'forehand', result: 'groundBounce' },
  { x: 89, y: 45, type: 'forehand', result: 'groundBounce' },
  { x: 54, y: 12, type: 'forehand', result: 'groundBounce' },
  { x: 73, y: 28, type: 'forehand', result: 'groundBounce' },
  { x: 18, y: 65, type: 'forehand', result: 'groundBounce' },

  // Backhand shots
  { x: 74, y: 26, type: 'backhand', result: 'interception' },
  { x: 27, y: 14, type: 'backhand', result: 'interception' },
  { x: 78, y: 29, type: 'backhand', result: 'interception' },
  { x: 46, y: 17, type: 'backhand', result: 'interception' },

  { x: 74, y: 19, type: 'backhand', result: 'groundBounce' },
  { x: 72, y: 51, type: 'backhand', result: 'groundBounce' },
  { x: 14, y: 64, type: 'backhand', result: 'groundBounce' },
  { x: 29, y: 66, type: 'backhand', result: 'groundBounce' },
  { x: 47, y: 68, type: 'backhand', result: 'groundBounce' },
  { x: 58, y: 65, type: 'backhand', result: 'groundBounce' },
  { x: 74, y: 68, type: 'backhand', result: 'groundBounce' },
  { x: 19, y: 52, type: 'backhand', result: 'groundBounce' },
  { x: 42, y: 46, type: 'backhand', result: 'groundBounce' },
  { x: 17, y: 64, type: 'backhand', result: 'groundBounce' },

  // Forehand volleys
  { x: 58, y: 29, type: 'forehandVolley', result: 'interception' },
  { x: 26, y: 17, type: 'forehandVolley', result: 'interception' },

  { x: 22, y: 68, type: 'forehandVolley', result: 'groundBounce' },
  { x: 40, y: 66, type: 'forehandVolley', result: 'groundBounce' },
  { x: 58, y: 64, type: 'forehandVolley', result: 'groundBounce' },
  { x: 75, y: 65, type: 'forehandVolley', result: 'groundBounce' },
  { x: 32, y: 54, type: 'forehandVolley', result: 'groundBounce' },
  { x: 49, y: 60, type: 'forehandVolley', result: 'groundBounce' },
  { x: 67, y: 58, type: 'forehandVolley', result: 'groundBounce' },
  { x: 28, y: 48, type: 'forehandVolley', result: 'groundBounce' },
  { x: 82, y: 52, type: 'forehandVolley', result: 'groundBounce' },
  { x: 60, y: 50, type: 'forehandVolley', result: 'groundBounce' },
  { x: 38, y: 36, type: 'forehandVolley', result: 'groundBounce' },
  { x: 52, y: 34, type: 'forehandVolley', result: 'groundBounce' },
  { x: 45, y: 33, type: 'forehandVolley', result: 'groundBounce' },
  { x: 61, y: 35, type: 'forehandVolley', result: 'groundBounce' },
  { x: 21, y: 0, type: 'forehandVolley', result: 'groundBounce' },
  { x: 31, y: 0, type: 'forehandVolley', result: 'groundBounce' },
  { x: 81, y: 0, type: 'forehandVolley', result: 'groundBounce' },

  // Backhand volleys
  { x: 57, y: 30, type: 'backhandVolley', result: 'interception' },
  { x: 27, y: 16, type: 'backhandVolley', result: 'interception' },

  { x: 23, y: 69, type: 'backhandVolley', result: 'groundBounce' },
  { x: 39, y: 67, type: 'backhandVolley', result: 'groundBounce' },
  { x: 59, y: 62, type: 'backhandVolley', result: 'groundBounce' },
  { x: 76, y: 66, type: 'backhandVolley', result: 'groundBounce' },
  { x: 33, y: 55, type: 'backhandVolley', result: 'groundBounce' },
  { x: 48, y: 59, type: 'backhandVolley', result: 'groundBounce' },
  { x: 66, y: 57, type: 'backhandVolley', result: 'groundBounce' },
  { x: 29, y: 47, type: 'backhandVolley', result: 'groundBounce' },
  { x: 83, y: 51, type: 'backhandVolley', result: 'groundBounce' },
  { x: 62, y: 49, type: 'backhandVolley', result: 'groundBounce' },
  { x: 37, y: 35, type: 'backhandVolley', result: 'groundBounce' },
  { x: 54, y: 33, type: 'backhandVolley', result: 'groundBounce' },
  { x: 44, y: 32, type: 'backhandVolley', result: 'groundBounce' },
  { x: 59, y: 34, type: 'backhandVolley', result: 'groundBounce' },
  { x: 20, y: 0, type: 'backhandVolley', result: 'groundBounce' },
  { x: 30, y: 0, type: 'backhandVolley', result: 'groundBounce' },
  { x: 82, y: 0, type: 'backhandVolley', result: 'groundBounce' },

  // Serves
  { x: 18, y: 43, type: 'serve', result: 'groundBounce' },
  { x: 28, y: 51, type: 'serve', result: 'groundBounce' },
  { x: 38, y: 30, type: 'serve', result: 'groundBounce' },
  { x: 48, y: 42, type: 'serve', result: 'groundBounce' },
  { x: 58, y: 44, type: 'serve', result: 'groundBounce' },
  { x: 68, y: 40, type: 'serve', result: 'groundBounce' },
  { x: 78, y: 51, type: 'serve', result: 'groundBounce' },
  { x: 88, y: 32, type: 'serve', result: 'groundBounce' },
  { x: 33, y: 48, type: 'serve', result: 'groundBounce' },
  { x: 63, y: 69, type: 'serve', result: 'groundBounce' },
  { x: 45, y: 47, type: 'serve', result: 'groundBounce' },
  { x: 75, y: 48, type: 'serve', result: 'groundBounce' },
  { x: 21, y: 40, type: 'serve', result: 'groundBounce' },
  { x: 85, y: 39, type: 'serve', result: 'groundBounce' },
  { x: 30, y: 70, type: 'serve', result: 'groundBounce' },

  // Overheads
  { x: 20, y: 45, type: 'overhead', result: 'groundBounce' },
  { x: 30, y: 53, type: 'overhead', result: 'groundBounce' },
  { x: 77, y: 46, type: 'overhead', result: 'groundBounce' },
  { x: 23, y: 41, type: 'overhead', result: 'groundBounce' },
  { x: 84, y: 37, type: 'overhead', result: 'groundBounce' },
  { x: 32, y: 68, type: 'overhead', result: 'groundBounce' },
];
