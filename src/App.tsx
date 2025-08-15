import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes.tsx';
import './App.module.scss';
import { ButtonConfigProvider } from '@shared/button/context/ButtonConfig.context';

import { AuthLoadingScreen, AuthProvider } from '@shared/auth-provider/AuthProvider.tsx';
import { IconMappingProvider } from '@shared/button/context/IconMapping.context';

function App() {
  return (
    <IconMappingProvider>
      <ButtonConfigProvider
        initialDefaults={{ variant: 'primary', size: 'md', iconPosition: 'left' }}
      >
        {/* Ora i toast hanno accesso al contesto delle icone */}
        {/* <AuthProvider fallback={<AuthLoadingScreen />}> */}
          <RouterProvider router={router} />
        {/* </AuthProvider> */}
      </ButtonConfigProvider>
    </IconMappingProvider>
  );
}

export default App;
