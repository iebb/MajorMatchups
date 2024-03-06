/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import { createRoot } from 'react-dom/client';
import './main.css';

import App from './main';


const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);
