import React, { createContext, useContext } from 'react';

const PUBLISHABLE_KEY = (typeof import.meta !== 'undefined' && import.meta.env) 
  ? import.meta.env.VITE_CLERK_PUBLISHABLE_KEY 
  : (typeof process !== 'undefined' ? process.env?.VITE_CLERK_PUBLISHABLE_KEY : undefined);

export const isClerkConfigured = Boolean(
  PUBLISHABLE_KEY &&
  PUBLISHABLE_KEY !== 'YOUR_CLERK_PUBLISHABLE_KEY'
);

interface ClerkStatusContextType {
  isConfigured: boolean;
  publishableKey: string | undefined;
}

const ClerkStatusContext = createContext<ClerkStatusContextType>({
  isConfigured: isClerkConfigured,
  publishableKey: PUBLISHABLE_KEY,
});

export const useClerkStatus = () => useContext(ClerkStatusContext);

export const clerkAppearance = {
  variables: {
    colorPrimary: '#000000',
    colorText: '#000000',
    colorBackground: '#ffffff',
    colorInputBackground: '#f9fafb',
    colorInputText: '#000000',
    borderRadius: '1rem',
    fontFamily: 'inherit',
  },
  elements: {
    card: 'shadow-lg border border-gray-200 rounded-3xl bg-white p-6',
    headerTitle: 'text-2xl font-black text-black tracking-tight',
    headerSubtitle: 'text-xs text-gray-500 font-medium',
    formButtonPrimary: 'bg-black hover:bg-gray-800 text-white font-bold rounded-xl text-xs py-3 transition-colors shadow-sm',
    formFieldInput: 'bg-gray-50 border border-gray-200 rounded-xl text-xs p-3 focus:ring-1 focus:ring-black focus:bg-white',
    formFieldLabel: 'text-xs font-bold text-gray-700',
    socialButtonsBlockButton: 'border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold py-2.5 transition-colors',
    footerActionLink: 'text-black font-bold hover:underline',
    userButtonAvatarBox: 'w-9 h-9 rounded-xl border border-gray-200',
    userButtonPopoverCard: 'shadow-xl border border-gray-200 rounded-2xl p-2 bg-white',
  },
};

export const ClerkWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkStatusContext.Provider value={{ isConfigured: isClerkConfigured, publishableKey: PUBLISHABLE_KEY }}>
      {children}
    </ClerkStatusContext.Provider>
  );
};
