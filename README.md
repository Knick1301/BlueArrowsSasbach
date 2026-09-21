# Blue Arrows Sasbach – Website

Vereinswebsite (Vue 3, Vite, Tailwind, Vue Router). Inhalte kommen aus [Storyblok](https://www.storyblok.com/).

## Einrichtung

```sh
npm install
cp .env.example .env.local   # danach VITE_STORYBLOK_TOKEN eintragen
npm run dev
```

`VITE_STORYBLOK_TOKEN`:

- **Entwicklung** (`.env.local`): Preview-Token. Der Dev-Server lädt Entwürfe und läuft über https, weil der Storyblok Visual Editor das braucht.
- **Produktion** (Umgebungsvariable beim Hosting, vor `npm run build` gesetzt): Public-Token. Der Build lädt nur veröffentlichte Inhalte.

Fehlt der Token, bricht die App beim Start mit einer Fehlermeldung ab.

## Befehle

| Befehl              | Zweck                                       |
| ------------------- | ------------------------------------------- |
| `npm run dev`       | Dev-Server                                  |
| `npm run build`     | Type-Check und Produktions-Build nach `dist/` |
| `npm run preview`   | Build lokal ansehen                         |
| `npm run test:unit` | Unit-Tests (Vitest)                         |
| `npm run lint`      | oxlint und ESLint                           |
| `npm run format`    | Prettier                                    |

## Deployment

Die Seite ist eine SPA mit History-Routing. Der Hoster muss unbekannte Pfade auf `index.html` umleiten (SPA-Fallback / Rewrite), sonst liefern direkte Aufrufe wie `/verein/kontakt` einen 404.

## Struktur

- `src/views/` – eine Seite pro Route (`src/router/index.ts`)
- `src/components/` – wiederverwendbare Bausteine (Spielerkarten, Tabellen, …)
- `src/utils/methods.ts` – Link-, Datums- und Bild-Helfer
- `src/utils/seo.ts` – Seitentitel und Meta-Tags; statische Routen setzen `meta.title` im Router, dynamische Seiten (Artikel, Teams) rufen `setPageMeta` selbst auf

## Chat-Assistent

Das Skript in `index.html` lädt den Chat-Assistenten von einem externen Vercel-Deployment. Er ist in der Datenschutzerklärung beschrieben; bei Änderungen dort mitpflegen.

## Bekannte Einschränkung

Titel und Open-Graph-Tags werden per JavaScript gesetzt. Suchmaschinen wie Google werten das aus, die Link-Vorschau von Facebook/WhatsApp meist nicht und zeigt daher die Standardwerte aus `index.html`. Für seitenspezifische Vorschauen wäre Prerendering nötig.
