import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, ColorSchemeProvider } from '@mantine/core';

const LazyApp = React.lazy(() => import('./App'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<div>Loading...</div>}>
    <MantineProvider>
      <ColorSchemeProvider>
        <LazyApp />
      </ColorSchemeProvider>
    </MantineProvider>
  </Suspense>
);
