// pages/Login/Login-layout.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@store_admin/auth/hooks/useAuth';
import './Login-layout.scss';

interface LoginFormData {
  emailOrUsername: string; // CAMBIATO: campo unico di input
  password: string;
  rememberMe?: boolean;
}

const LoginLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login,
    isLoading,
    error,
    isAuthenticated,
    user,
    clearError
  } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect se già autenticato
  useEffect(() => {
    console.log('Auth state in LoginLayout:', {
      isAuthenticated,
      user: user?.email,
      isInitialized: true
    });
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      console.log('User authenticated, redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  // Pulisci errori quando il componente monta
  useEffect(() => {
    clearError();
    setLocalError(null);
  }, [clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Pulisci errori quando l'utente inizia a digitare
    if (error || localError) {
      clearError();
      setLocalError(null);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Determina se l'input è un'email (per UI/validazione, NON per payload)
  const isEmail = (input: string): boolean => {
    return input.includes('@') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  // Validazione aggiornata
  const validateForm = (): string | null => {
    if (!formData.emailOrUsername) {
      return 'Email o username richiesti';
    }
    // Se contiene @, validalo come email
    if (formData.emailOrUsername.includes('@') && !isEmail(formData.emailOrUsername)) {
      return 'Email non valida';
    }
    // Se non contiene @, validalo come username (almeno 3 caratteri, no spazi)
    if (!formData.emailOrUsername.includes('@')) {
      if (formData.emailOrUsername.length < 3) {
        return 'Username deve essere di almeno 3 caratteri';
      }
      if (formData.emailOrUsername.includes(' ')) {
        return 'Username non può contenere spazi';
      }
    }
    if (!formData.password) {
      return 'Password richiesta';
    }
    if (formData.password.length < 6) {
      return 'Password deve essere di almeno 6 caratteri';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validazione locale
    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      // CAMBIATO: inviamo sempre `username` come identificatore (email o username)
      const loginData = {
        username: formData.emailOrUsername,
        password: formData.password,
        rememberMe: formData.rememberMe
      };

      console.log('Attempting login with identifier:', {
        username: loginData.username,
        isEmail: isEmail(loginData.username)
      });

      
      const result = await login(loginData);

      console.log('Login result:', result);

      if ((result as any)?.type === 'auth/loginAsync/fulfilled') {
        console.log('Login successful, user will be redirected by useEffect');
      } else if ((result as any)?.type === 'auth/loginAsync/rejected') {
        console.log('Login failed:', (result as any)?.payload);
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalError('Errore imprevisto durante il login');
    }
  };

  // Determina quale errore mostrare
  const displayError = localError || error;

  return (
    <div className="login-page">
      {/* Background Decorations */}
      <div className="background-decorations">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
        <div className="decoration-blob blob-1"></div>
        <div className="decoration-blob blob-2"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
      </div>

      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <div className="brand">
            <div className="brand-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3.09 8.26L4 9L12 4L20 9L20.91 8.26L12 2Z" fill="url(#gradient1)"/>
                <path d="M4 9V15L12 20L20 15V9L12 14L4 9Z" fill="url(#gradient2)"/>
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4facfe" />
                    <stop offset="100%" stopColor="#00f2fe" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="brand-text">
              <h1>Portale Press</h1>
              <span>Admin Panel</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="login-content">
          {/* Side Panel */}
          <div className="side-panel">
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="#4facfe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="9" stroke="#4facfe" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Sicurezza Avanzata</h4>
                  <p>Protezione completa dei tuoi dati</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#667eea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Performance Ottimali</h4>
                  <p>Velocità e affidabilità garantite</p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M17 21V19C17 17.9 16.1 17 15 17H9C7.9 17 7 17.9 7 19V21" stroke="#764ba2" strokeWidth="2" strokeLinecap="round"/>
                    <circle cx="12" cy="7" r="4" stroke="#764ba2" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="feature-text">
                  <h4>Gestione Utenti</h4>
                  <p>Controllo completo degli accessi</p>
                </div>
              </div>
            </div>

            <div className="stats">
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Supporto</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">500K+</div>
                <div className="stat-label">Utenti</div>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="login-card">
            <div className="card-glow"></div>

            <div className="login-form">
              <div className="form-header">
                <h3>Accedi</h3>
                <p>Inserisci le tue credenziali</p>
              </div>

              {/* Error Display */}
              {displayError && (
                <div className="error-message">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  {displayError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  {/* Label e placeholder per email o username */}
                  <label htmlFor="emailOrUsername">Email o Username</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      id="emailOrUsername"
                      name="emailOrUsername"
                      value={formData.emailOrUsername}
                      onChange={handleInputChange}
                      placeholder="Inserisci email o username"
                      required
                      disabled={isLoading}
                    />
                    <span className="input-icon">
                      {/* Icona dinamica */}
                      {isEmail(formData.emailOrUsername) ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                          <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Inserisci la tua password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2"/>
                          <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe || false}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    <span className="checkmark"></span>
                    Ricordami
                  </label>
                  <a href="#forgot" className="forgot-link">
                    Password dimenticata?
                  </a>
                </div>

                <button
                  type="submit"
                  className="login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Accesso in corso...
                    </>
                  ) : (
                    'Accedi'
                  )}
                </button>
              </form>
            </div>

            <div className="login-footer">
              <p>
                Non hai un account?{' '}
                <a href="#signup" className="signup-link">
                  Registrati qui
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
