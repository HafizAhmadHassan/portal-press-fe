import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@store_admin/auth/hooks/useAuth";

type QueryGuard = {
  /** Nome del parametro query da bloccare (es: "edit") */
  param: string;
  /** Ruoli a cui è consentito mantenere il parametro (se vuoto → tutti) */
  allowRoles?: string[];
  /**
   * Condizione aggiuntiva per applicare il blocco (es: solo in pagina di dettaglio device).
   * Se non fornita → sempre vero.
   */
  predicate?: (location: ReturnType<typeof useLocation>) => boolean;
  /** Suffix path da rimuovere se presenti (es: "/edit", "/edit/") */
  stripPathSuffixes?: string[];
};

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: string;
  requiredRoles?: string[];
  /** Regole opzionali per sanificare l'URL in base al ruolo */
  queryGuards?: QueryGuard[];
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requiredRoles,
  queryGuards,
}: ProtectedRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, userRole, isInitialized, initializeAuth } =
    useAuth();

  // 1) Inizializza auth - HOOK PRIMA DI QUALSIASI RETURN
  useEffect(() => {
    if (!isInitialized && !isAuthenticated) {
      initializeAuth();
    }
  }, [isInitialized, isAuthenticated, initializeAuth]);

  // 2) Sanifica URL in base a queryGuards - SEMPRE PRIMA DI QUALSIASI RETURN
  useEffect(() => {
    if (!queryGuards || queryGuards.length === 0) return;

    let nextPathname = location.pathname;
    const nextSearch = new URLSearchParams(location.search);
    let changed = false;

    for (const guard of queryGuards) {
      // se il ruolo è consentito → non applico il guard
      if (guard.allowRoles && userRole && guard.allowRoles.includes(userRole)) {
        continue;
      }
      // predicate opzionale per limitare dove si applica il guard
      const ok = guard.predicate ? guard.predicate(location) : true;
      if (!ok) continue;

      // rimuovi il parametro query
      if (nextSearch.has(guard.param)) {
        nextSearch.delete(guard.param);
        changed = true;
      }

      // rimuovi eventuali suffix nel path
      if (guard.stripPathSuffixes?.length) {
        for (const suf of guard.stripPathSuffixes) {
          if (nextPathname.endsWith(suf)) {
            nextPathname = nextPathname.slice(
              0,
              nextPathname.length - suf.length
            );
            changed = true;
            break;
          }
        }
      }
    }

    if (changed) {
      navigate(
        { pathname: nextPathname, search: nextSearch.toString() },
        { replace: true }
      );
    }
  }, [queryGuards, location.pathname, location.search, userRole, navigate]);

  // 3) Calcola cosa rendere (niente early return prima degli hook)
  let element: React.ReactElement;

  if (!isInitialized) {
    element = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Caricamento...
      </div>
    );
  } else if (!isAuthenticated) {
    element = <Navigate to="/login" state={{ from: location }} replace />;
  } else if (requiredRole && userRole !== requiredRole) {
    element = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#dc2626",
        }}
      >
        Non hai i permessi per accedere a questa pagina
      </div>
    );
  } else if (
    requiredRoles &&
    (!userRole || !requiredRoles.includes(userRole))
  ) {
    element = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#dc2626",
        }}
      >
        Non hai i permessi per accedere a questa pagina
      </div>
    );
  } else {
    element = children;
  }

  // 4) Un solo return finale
  return element;
}
