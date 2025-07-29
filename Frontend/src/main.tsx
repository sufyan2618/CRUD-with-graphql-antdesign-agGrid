import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'
import { ApolloProviderWrapper } from './app/providers/ApolloProvider.tsx'

import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
// --- END OF AG GRID REGISTRATION ---


createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ApolloProviderWrapper>
    <App />
  </ApolloProviderWrapper>
  </StrictMode>,
)
