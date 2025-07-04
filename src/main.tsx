import './polyfills';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

console.log('Main.tsx loaded');
console.log('React version:', React.version);

// React 18 supports createRoot and works with proper polyfills
const container = document.getElementById('root');
console.log('Root container:', container);

if (container) {
  try {
    console.log('Creating root...');
    const root = createRoot(container);
    console.log('Root created, rendering app...');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('App rendered successfully');
  } catch (error) {
    console.error('Error rendering app:', error);
  }
} else {
  console.error('Root container not found!');
}