# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This webapp serves as an AI Report for Matchlytics startup, displaying Padel game metrics and analytics. The application is designed to be served as a webview within a React application, providing comprehensive match analysis and visualization.

## Development Commands

- `yarn dev` - Start development server with Vite
- `yarn build` - TypeScript compile and production build (`tsc && vite build`)
- `yarn preview` - Preview production build locally
- `yarn format` - Format code with Prettier
- `yarn deploy` - Deploy to GitHub Pages

## Architecture

This is a React + TypeScript application built with Vite, focused on Padel match analytics visualization and reporting.

### Core Structure
- **Entry Point**: `src/main.tsx` renders the app with React 18's `createRoot`
- **Routing**: React Router with routes for entry page (`/`), game report (`/report/:playerId`), and 3D demo (`/3d`)
- **Main Components**:
  - `EntryPage` - Landing/selection page
  - `GameReport` - Main analytics dashboard
  - `Test` - 3D visualization demo
  - `BallMap/` - Complex tennis court visualization with heatmaps and ball tracking

### Key Features
- **BallMap Component**: Sophisticated Padel court visualization with multiple modes:
  - Ball hits tracking with shot type filtering
  - Player position heatmaps 
  - Animated transitions and fade effects
  - Uses heatmap.js for data visualization
- **3D Visualization**: Three.js integration via @react-three/fiber and @react-three/drei
- **Charts**: Multiple chart components (CircleChart, DualCircleChart, TripleCricleChart)
- **Padel Analytics**: Speed cards, serves analysis, player stats, match summaries

### Technical Configuration
- **Path Aliases**: `@/*` maps to `src/*`
- **Browser Support**: Legacy browser support with extensive polyfills for Chrome 61+, Firefox 60+, Safari 11+, Edge 16+
- **Styling**: Tailwind CSS with custom utilities
- **Linting**: ESLint with TypeScript, React, and Prettier integration
- **Build Target**: ES2015 with sourcemaps enabled

### Development Notes
- Uses custom polyfills for legacy browser compatibility
- Extensive TypeScript configuration with strict mode
- Components follow React functional patterns with hooks
- Global CSS utilities and Tailwind merge for class handling
- amazing job, just to give you some context, this webapp will be presented as a AI Report for my start up company Matchlytics. This will be served in a reactapp as a webview. This will display the metrics of a game of Padel.