// utils/jwt.utils.ts
export interface JWTPayload {
  user_id: string;
  username: string;
  email: string;
  role: string;
  token_type?: string; // access, refresh
  exp: number;
  iat: number;
  jti?: string;
  [key: string]: any;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // Dividi il token in 3 parti
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Token JWT non valido");
    }

    // Decodifica il payload (seconda parte)
    const payload = parts[1];

    // Aggiungi padding se necessario
    const paddedPayload = payload.padEnd(
      payload.length + ((4 - (payload.length % 4)) % 4),
      "="
    );

    // Decodifica da base64
    const decodedPayload = atob(paddedPayload);

    // Parsa il JSON
    const parsedPayload = JSON.parse(decodedPayload);

    return parsedPayload as JWTPayload;
  } catch (error) {
    console.error("Errore nella decodifica del JWT:", error);
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      return true;
    }

    // exp è in secondi, Date.now() è in millisecondi
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

export const getUserFromToken = (token: string): any | null => {
  try {
    const payload = decodeJWT(token);
    if (!payload) return null;

    return {
      id: payload.user_id || payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      // Aggiungi altri campi se presenti nel token
    };
  } catch {
    return null;
  }
};

// Funzione di debug per analizzare i token
export const debugToken = (token: string, tokenName: string = "Token") => {
  console.group(`🔍 Debug ${tokenName}`);

  try {
    const payload = decodeJWT(token);

    if (payload) {
      console.log("📝 Payload completo:", payload);
      console.log("🆔 User ID:", payload.user_id);
      console.log("👤 Username:", payload.username);
      console.log("📧 Email:", payload.email);
      console.log("🏷️ Token Type:", payload.token_type);
      console.log(
        "⏰ Issued At:",
        new Date(payload.iat * 1000).toLocaleString()
      );
      console.log(
        "⏰ Expires At:",
        new Date(payload.exp * 1000).toLocaleString()
      );
      console.log("⏳ Is Expired:", isTokenExpired(token));

      // Verifica se è un access o refresh token
      if (payload.token_type === "refresh") {
        console.warn(
          "⚠️ ATTENZIONE: Questo è un REFRESH token, non un ACCESS token!"
        );
        console.warn(
          "❌ Non puoi usare un refresh token per le chiamate API autenticate"
        );
      } else if (payload.token_type === "access") {
        console.log("✅ Questo è un ACCESS token valido");
      } else {
        console.warn(
          "⚠️ Tipo di token non specificato o non riconosciuto:",
          payload.token_type
        );
      }
    } else {
      console.error("❌ Impossibile decodificare il token");
    }
  } catch (error) {
    console.error("💥 Errore durante il debug del token:", error);
  }

  console.groupEnd();
};

// Funzione per confrontare due token
export const compareTokens = (token1: string, token2: string) => {
  console.group("🔍 Confronto Token");

  const payload1 = decodeJWT(token1);
  const payload2 = decodeJWT(token2);

  if (payload1 && payload2) {
    console.log("Token 1 Type:", payload1.token_type);
    console.log("Token 2 Type:", payload2.token_type);
    console.log("Same User:", payload1.user_id === payload2.user_id);
    console.log("Token 1 Expires:", new Date(payload1.exp * 1000));
    console.log("Token 2 Expires:", new Date(payload2.exp * 1000));
    console.log(
      "Time diff (minutes):",
      Math.abs(payload1.exp - payload2.exp) / 60
    );
  }

  console.groupEnd();
};

// Ottieni tempo rimanente prima della scadenza
export const getTokenTimeRemaining = (token: string): number => {
  try {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return 0;

    const currentTime = Date.now() / 1000;
    const timeRemaining = payload.exp - currentTime;

    return Math.max(0, timeRemaining);
  } catch {
    return 0;
  }
};

// Formatta tempo rimanente in stringa leggibile
export const formatTokenTimeRemaining = (token: string): string => {
  const seconds = getTokenTimeRemaining(token);

  if (seconds <= 0) return "Scaduto";

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${Math.floor(seconds % 60)}s`;
  return `${Math.floor(seconds)}s`;
};
