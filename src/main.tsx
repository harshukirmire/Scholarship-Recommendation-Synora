import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/react';
import App from './App.tsx';
import './index.css';

// Utilize VITE_CLERK_PUBLISHABLE_KEY environment variable with resilient fallback
const RAW_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const PUBLISHABLE_KEY = (RAW_KEY && RAW_KEY !== 'YOUR_CLERK_PUBLISHABLE_KEY') 
  ? RAW_KEY 
  : 'pk_test_Y2xlcmsuc3lub3JhLmRldiQ';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </StrictMode>,
);
