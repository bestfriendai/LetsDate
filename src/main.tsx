import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';

function ThemedApp() {
  const { isDarkMode } = useTheme();

  return (
    <NextUIProvider>
      <main className={isDarkMode ? 'dark' : 'light'}>
        <App />
      </main>
    </NextUIProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </StrictMode>
);// Force rebuild
