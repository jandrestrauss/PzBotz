
import React from 'react';
import { MantineProvider } from '@mantine/core';

interface AppProps {
  children?: React.ReactNode;
}

export const App: React.FC<AppProps> = ({ children }) => {
  return (
    <MantineProvider>
      <div className="app-container">
        {children}
      </div>
    </MantineProvider>
  );
};