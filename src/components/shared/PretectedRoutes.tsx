// shared/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@store_admin/auth/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: string;
  requiredRoles?: string[];
}

export default function ProtectedRoute({
                                         children,
                                         requiredRole,
                                         requiredRoles
                                       }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, userRole, isInitialized, initializeAuth } = useAuth();

  // Inizializza l'auth quando il ProtectedRoute viene montato
  useEffect(() => {
    // Non inizializzare se è già autenticato
    if (!isInitialized && !isAuthenticated) {
      console.log('ProtectedRoute: Initializing auth...');
      initializeAuth();
    }
  }, [isInitialized, isAuthenticated, initializeAuth]);

  // Mostra loading se non ancora inizializzato
  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Caricamento...
      </div>
    );
  }

  // Redirect al login se non autenticato, preservando la location corrente
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Controllo ruolo specifico
  if (requiredRole && userRole !== requiredRole) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#dc2626'
      }}>
        Non hai i permessi per accedere a questa pagina
      </div>
    );
  }

  // Controllo ruoli multipli
  if (requiredRoles && (!userRole || !requiredRoles.includes(userRole))) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#dc2626'
      }}>
        Non hai i permessi per accedere a questa pagina
      </div>
    );
  }

  return children;
}