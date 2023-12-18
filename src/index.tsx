import { StrictMode } from 'react';
import App from './app/App';
import { RootProvider } from './app/providers/RootProvider';
import './shared/config/i18n';
import { createRoot } from 'react-dom/client';
import './entities/User/api/locations';
const root = createRoot(document.getElementById('root')!);
root.render(
    <RootProvider>
      <App />
    </RootProvider>
  )
