# 🍞 Toast Library - Sistema di Notifiche Riutilizzabile

Sistema completo di toast/notifiche configurabile, plug-and-play, pronto per essere copiato in qualsiasi progetto React + TypeScript.

## 📦 Installazione

### 1. Copia la cartella `lib/toast` nel tuo progetto

```
src/
  lib/
    toast/
      ├── index.ts              # Export principale
      ├── ToastContext.tsx      # Provider e Context
      ├── ToastContainer.tsx    # Container per rendering
      ├── Toast.tsx             # Componente singolo toast
      ├── useToast.ts           # Hook principale
      └── toast.scss            # Stili completi
```

### 2. Aggiungi il Provider nell'app

```tsx
// src/main.tsx o App.tsx
import { ToastProvider, ToastContainer } from '@/lib/toast';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <App />
      <ToastContainer /> {/* Importante! Renderizza i toast */}
    </ToastProvider>
  </StrictMode>
);
```

### 3. Usa ovunque con `useToast()`

```tsx
import { useToast } from '@/lib/toast';

function MyComponent() {
  const toast = useToast();

  const handleSuccess = () => {
    toast.success('Operazione completata!');
  };

  return <button onClick={handleSuccess}>Click me</button>;
}
```

---

## 🚀 Utilizzo

### Metodi Base

```tsx
const toast = useToast();

// 1️⃣ Success
toast.success('Utente creato con successo!');
toast.success('Salvato!', 'Operazione completata'); // Con titolo
toast.success('Done!', 'Success', 3000); // Con durata custom

// 2️⃣ Error
toast.error('Impossibile salvare i dati');
toast.error('Errore di rete', 'Connessione fallita');

// 3️⃣ Warning
toast.warning('Attenzione: dati non salvati');
toast.warning('Limite raggiunto', 'Spazio esaurito');

// 4️⃣ Info
toast.info('Nuova versione disponibile');
toast.info('10 messaggi non letti', 'Notifiche');
```

### Configurazione Avanzata

```tsx
const toast = useToast();

// Toast con tutte le opzioni
toast.toast({
  type: 'success',
  title: 'Titolo opzionale',
  message: 'Questo è il messaggio principale',
  duration: 5000, // millisecondi (0 = mai chiuso automaticamente)
  position: 'top-right', // o top-left, top-center, bottom-left, etc.
  dismissible: true, // mostra pulsante chiudi
  onClose: () => console.log('Toast chiuso!'),
});

// Toast persistente (non si chiude da solo)
toast.toast({
  type: 'warning',
  message: 'Questo toast rimane finché non lo chiudi',
  duration: 0,
  dismissible: true,
});

// Toast senza pulsante chiudi
toast.toast({
  type: 'info',
  message: 'Questo si chiude automaticamente',
  duration: 3000,
  dismissible: false,
});
```

### Posizioni Disponibili

```tsx
toast.toast({
  message: 'Top Left',
  position: 'top-left'
});

toast.toast({
  message: 'Top Center',
  position: 'top-center'
});

toast.toast({
  message: 'Top Right (default)',
  position: 'top-right'
});

toast.toast({
  message: 'Bottom Left',
  position: 'bottom-left'
});

toast.toast({
  message: 'Bottom Center',
  position: 'bottom-center'
});

toast.toast({
  message: 'Bottom Right',
  position: 'bottom-right'
});
```

### Utility Functions

```tsx
const toast = useToast();

// Chiudi un toast specifico (usa ID custom)
toast.toast({
  id: 'my-unique-id',
  message: 'Toast con ID custom'
});
toast.hide('my-unique-id');

// Chiudi tutti i toast
toast.clearAll();
```

---

## 🎨 Varianti di Stile

### 4 Tipi Predefiniti

| Tipo | Colore | Icona | Uso |
|------|--------|-------|-----|
| `success` | Verde | ✓ | Operazioni completate |
| `error` | Rosso | ✕ | Errori e fallimenti |
| `warning` | Arancione | ⚠ | Avvisi e attenzioni |
| `info` | Blu | ℹ | Informazioni generali |

Ogni tipo ha:
- ✅ Colore distintivo sul bordo sinistro
- ✅ Icona colorata
- ✅ Animazioni personalizzate

---

## 📱 Responsive

- ✅ **Desktop**: min-width 300px, max-width 500px
- ✅ **Mobile**: Si adatta alla larghezza dello schermo
- ✅ **Multiple notifiche**: Stack automatico con gap
- ✅ **Overflow**: Scroll automatico se troppi toast

---

## 🎭 Animazioni

### Entrance Animations
- **Top positions**: Slide dall'alto + fade in
- **Bottom positions**: Slide dal basso + fade in
- **Durata**: 300ms con easing cubic-bezier

### Exit Animations
- **Top positions**: Slide verso l'alto + fade out
- **Bottom positions**: Slide verso il basso + fade out
- **Durata**: 300ms

---

## 🌗 Dark Mode

Supporto automatico per `prefers-color-scheme: dark`:
- ✅ Background scuro automatico
- ✅ Testo chiaro
- ✅ Contrasti ottimizzati

---

## 🧩 Esempi Completi

### Esempio 1: Form con Validazione

```tsx
import { useToast } from '@/lib/toast';

function LoginForm() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Login effettuato!', 'Benvenuto');
    } catch (error) {
      toast.error(
        'Credenziali non valide',
        'Errore di autenticazione'
      );
    } finally {
      setLoading(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Esempio 2: Conferma Eliminazione

```tsx
import { useToast } from '@/lib/toast';

function UserList() {
  const toast = useToast();

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success('Utente eliminato', 'Operazione completata');
    } catch (error) {
      toast.error(
        'Impossibile eliminare l\'utente',
        'Errore',
        8000 // Rimane 8 secondi
      );
    }
  };

  return <div>...</div>;
}
```

### Esempio 3: Multi-step con Progress

```tsx
import { useToast } from '@/lib/toast';

function FileUploader() {
  const toast = useToast();

  const handleUpload = async (files: File[]) => {
    // Step 1: Inizio
    toast.info(`Caricamento di ${files.length} file...`, 'Upload');

    try {
      // Step 2: Processing
      await uploadFiles(files);
      
      // Step 3: Success
      toast.success(
        `${files.length} file caricati con successo!`,
        'Completato'
      );
    } catch (error) {
      // Step 4: Error
      toast.error(
        'Errore durante il caricamento',
        'Upload fallito'
      );
    }
  };

  return <div>...</div>;
}
```

### Esempio 4: Notifica Persistente con Azione

```tsx
import { useToast } from '@/lib/toast';

function NotificationExample() {
  const toast = useToast();

  const showUpdateNotification = () => {
    toast.toast({
      type: 'info',
      title: 'Aggiornamento disponibile',
      message: 'È disponibile una nuova versione dell\'app',
      duration: 0, // Non si chiude automaticamente
      dismissible: true,
      onClose: () => {
        console.log('Utente ha chiuso la notifica');
      },
    });
  };

  return <button onClick={showUpdateNotification}>Check Updates</button>;
}
```

---

## ⚙️ API Reference

### `useToast()` Hook

Ritorna un oggetto con questi metodi:

```typescript
{
  // Metodo generico
  toast: (config: ToastConfig | string) => void;
  
  // Shortcuts
  success: (message: string, title?: string, duration?: number) => void;
  error: (message: string, title?: string, duration?: number) => void;
  warning: (message: string, title?: string, duration?: number) => void;
  info: (message: string, title?: string, duration?: number) => void;
  
  // Utility
  hide: (id: string) => void;
  clearAll: () => void;
}
```

### `ToastConfig` Interface

```typescript
interface ToastConfig {
  id?: string;                 // ID unico (auto-generato se omesso)
  type?: ToastType;            // 'success' | 'error' | 'warning' | 'info'
  title?: string;              // Titolo opzionale
  message: string;             // Messaggio (richiesto)
  duration?: number;           // Millisecondi (default: 5000, 0 = infinito)
  position?: ToastPosition;    // Posizione (default: 'top-right')
  dismissible?: boolean;       // Mostra pulsante X (default: true)
  onClose?: () => void;        // Callback quando chiuso
}
```

---

## 🔧 Personalizzazione

### Modifica Colori

Edita `toast.scss`:

```scss
.kgn-toast {
  &--success {
    border-left-color: #10b981; // Cambia questo
    .kgn-toast__icon {
      background: #10b981;      // E questo
    }
  }
}
```

### Modifica Durata Animazione

```scss
.kgn-toast {
  transition: all 0.3s; // Cambia 0.3s

  &--entering {
    animation: kgn-toast-slide-in 0.3s; // Cambia qui
  }
}
```

### Aggiungi Nuove Icone

```tsx
// In Toast.tsx
const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  custom: '🎉', // Aggiungi nuove
};
```

---

## 📋 Checklist Setup

- [ ] Copiata cartella `lib/toast` nel progetto
- [ ] Aggiunto `<ToastProvider>` in `main.tsx`
- [ ] Aggiunto `<ToastContainer />` dopo `<App />`
- [ ] Testato con `toast.success('Test!')`
- [ ] Verificato responsive su mobile
- [ ] Personalizzati colori (opzionale)

---

## 🐛 Troubleshooting

### Toast non appaiono

**Soluzione**: Verifica che `<ToastContainer />` sia renderizzato:

```tsx
<ToastProvider>
  <App />
  <ToastContainer /> {/* ← Importante! */}
</ToastProvider>
```

### Errore "useToastContext must be used within ToastProvider"

**Soluzione**: Assicurati che il componente sia dentro `<ToastProvider>`.

### Stili non applicati

**Soluzione**: Importa gli stili:

```tsx
// In main.tsx o App.tsx
import '@/lib/toast/toast.scss';
```

---

## 🎉 Features

- ✅ **Zero dipendenze** (solo React)
- ✅ **TypeScript** completo
- ✅ **4 varianti** (success, error, warning, info)
- ✅ **6 posizioni** (tutti gli angoli + centro)
- ✅ **Animazioni** fluide
- ✅ **Responsive** mobile-friendly
- ✅ **Dark mode** automatico
- ✅ **Accessibile** (ARIA labels, keyboard)
- ✅ **Configurabile** per ogni toast
- ✅ **Auto-dismiss** con timer
- ✅ **Stack multipli** per posizione
- ✅ **Hook semplice** `useToast()`

---

**Creato con ❤️ per KGN**  
Pronto per essere copiato in qualsiasi progetto React!
