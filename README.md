# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

---

## 📋 Prerequisiti

- **Node.js** versione 16 o superiore
- **npm** o **yarn**
- **Git**

## 🚀 Installazione

1. **Clona il repository**
   ```bash
   git clone <url-del-repository>
   cd nome-progetto
   ```

2. **Installa le dipendenze**
   ```bash
   npm install
   # oppure
   yarn install
   ```

3. **Configura le variabili d'ambiente**
   
   Crea un file `.env` nella root del progetto:
   ```bash
   # .env (per sviluppo locale)
   VITE_API_BASE_URL=http://localhost:8000
   VITE_API_HASSAN_URL=http://35.152.52.213/myapi/
   VITE_IMAGE_DEFAULT=https://public-assets.ayayot.com/4081-0733-7005-8389-2939/38/e5/9c8102cb24c5ba8f5ae5e12216abffde7b947fb036e70808a4b091f80c98c57cd21d5548e3da8767fd3bcab35c0bbddc57f6683cd790e55269a3097ef8d3.png
   ```

## 🛠️ Comandi Disponibili

### Sviluppo
```bash
# Avvia il server di sviluppo
npm run dev
# oppure
yarn dev

# L'applicazione sarà disponibile su http://localhost:5173
```

### Build di Produzione
```bash
# Crea la build di produzione
npm run build
# oppure
yarn build

# La cartella 'dist/' conterrà i file pronti per il deploy
```

### Preview della Build
```bash
# Testa la build localmente
npm run preview
# oppure
yarn preview
```

### Linting e Formattazione
```bash
# Controlla la sintassi del codice
npm run lint

# Corregge automaticamente gli errori
npm run lint:fix
```

## 🌍 Configurazione Ambienti

### Sviluppo (`.env`)
```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_API_HASSAN_URL=http://35.152.52.213/myapi/
VITE_IMAGE_DEFAULT=https://public-assets.ayayot.com/...
```

### Produzione (`.env.production`)
```bash
VITE_API_BASE_URL=http://35.152.52.213/myapi/
VITE_API_HASSAN_URL=http://35.152.52.213/myapi/
VITE_IMAGE_DEFAULT=https://public-assets.ayayot.com/...
```

## 🚀 Deploy su AWS S3 + CloudFront

### Preparazione per il Deploy

1. **Assicurati che il file `.env.production` sia configurato correttamente**

2. **Crea la build di produzione**
   ```bash
   npm run build
   ```

3. **La cartella `dist/` contiene tutti i file da deployare**

### Configurazione AWS

#### S3 Bucket
- Abilita **Static Website Hosting**
- Imposta `index.html` come documento principale
- Configura le policy per l'accesso pubblico

#### CloudFront
- Crea una distribuzione CloudFront
- Imposta l'S3 bucket come origine
- **Importante**: Configura le **Custom Error Pages** per SPA:
  - Error Code: `403` → Response Page: `/index.html` → Response Code: `200`
  - Error Code: `404` → Response Page: `/index.html` → Response Code: `200`

### Comandi per il Deploy
```bash
# 1. Build di produzione
npm run build

# 2. Sync con S3 (esempio con AWS CLI)
aws s3 sync dist/ s3://nome-bucket --delete

# 3. Invalida cache CloudFront
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

## 📁 Struttura del Progetto

```
src/
├── components/          # Componenti riutilizzabili
├── pages/              # Pagine dell'applicazione
├── services/           # Servizi per API calls
├── utils/              # Utilities e helper
├── assets/             # Immagini, fonts, etc.
├── styles/             # CSS/SCSS globali
└── environments/       # File di configurazione
```

## 🔧 Variabili d'Ambiente Utilizzate

| Variabile | Descrizione | Esempio |
|-----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base delle API | `http://localhost:8000` |
| `VITE_API_HASSAN_URL` | URL API Hassan | `http://35.152.52.213/myapi/` |
| `VITE_IMAGE_DEFAULT` | Immagine di default | `https://public-assets.ayayot.com/...` |

## 🐛 Troubleshooting

### Errori Comuni

**1. Errori CORS in produzione**
- Verifica che il backend accetti richieste dal dominio CloudFront
- Controlla le configurazioni CORS del server

**2. Rotte non funzionano dopo il deploy**
- Assicurati che CloudFront sia configurato per SPA
- Verifica le Custom Error Pages

**3. Variabili d'ambiente non caricate**
- Controlla che il file `.env.production` esista
- Verifica che le variabili inizino con `VITE_`

### Log Utili
```bash
# Verifica build
npm run build -- --mode production

# Debug variabili
console.log(import.meta.env)
```

