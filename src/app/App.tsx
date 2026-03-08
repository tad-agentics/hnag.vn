import { RouterProvider } from 'react-router';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import { registerServiceWorker } from './utils/pwa';

export default function App() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}