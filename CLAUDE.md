# CLAUDE.md

Vereinswebsite der **Blue Arrows Sasbach** (Inline-Skaterhockey). Vue-3-SPA mit Vite, TypeScript, Tailwind v4 und Vue Router. Inhalte kommen aus dem Headless-CMS **Storyblok**, Spielpläne und Tabellen von **ISHD** (ishd.de) über einen eigenen Proxy.

Sprache im Projekt ist **Deutsch**: UI-Texte, Kommentare, Fehlermeldungen, Testbeschreibungen und Commit-Nachrichten auf Deutsch schreiben. Bezeichner im Code dürfen englisch oder deutsch sein – sich am umgebenden Code orientieren (z. B. `useTermine`, `KATEGORIE_REIHENFOLGE`, `getNewsDate`).

## Befehle

```sh
npm install
cp .env.example .env.local      # VITE_STORYBLOK_TOKEN eintragen
npm run dev                     # Dev-Server auf https://localhost:5173 (fester Port, selbstsigniertes Zertifikat)
npm run build                   # vue-tsc Type-Check + Vite-Build nach dist/
npm run test:unit               # Vitest (jsdom); einmalig: npx vitest run
npm run lint                    # oxlint + ESLint, beide mit --fix
npm run format                  # Prettier auf src/
```

Vor dem Abschluss einer Änderung: `npm run build` (inkl. Type-Check), `npx vitest run` und `npm run lint` müssen sauber durchlaufen.

## Umgebungsvariablen

- `VITE_STORYBLOK_TOKEN` – Pflicht. Ohne Token wirft `src/main.ts` beim Start einen Fehler.
  - Entwicklung: Preview-Token → lädt **Entwürfe** (`draft`).
  - Produktion: Public-Token → lädt nur **veröffentlichte** Inhalte (`published`).
- `VITE_ISHD_API_URL` – Adresse des ISHD-Proxys. Leer = `/api/ishd`. Beim Webhoster `/api/ishd.php`. Lokal leer lassen.
- `VITE_ANMELDUNG_API_URL` – Endpunkt der Laufschul-Anmeldung. Leer = `/api/anmeldung`. Beim Webhoster `/api/anmeldung.php`. Lokal leer lassen.

`.env.local` ist per `*.local` ignoriert – niemals Tokens committen.

## Architektur

```
src/
  main.ts            App-Setup: StoryblokVue + Router
  App.vue            Layout (Header/Navigation, Footer), lädt Navigation aus Storyblok-Story global/config;
                     <router-view> steckt in <Suspense>
  storyblok.ts       STORYBLOK_VERSION ('draft' im Dev, sonst 'published'), CONFIG_STORY
  router/index.ts    alle Routen (lazy geladen), setzt Seitentitel über meta.title
  views/             eine Komponente pro Route
  components/        wiederverwendbare Bausteine (Karten, ISHD-Spielplan/-Tabelle, Lightbox …)
  composables/       useIshd (ISHD-Daten), useTermine (Termine aus Storyblok + ISHD), useLightbox
  utils/             reine Helfer: methods (Links, Datum, Bilder), seo, ishd, kontakt, trainings, games
  types/ishd.ts      Typen für die ISHD-Antworten
api/ishd.ts          ISHD-Proxy als Vercel-Funktion (Übergangslösung)
public/api/ishd.php  ISHD-Proxy für den PHP-Webhoster, mit Datei-Cache in public/api/cache/
```

### Storyblok

- Immer `version: STORYBLOK_VERSION` aus `@/storyblok` übergeben, nie `'draft'`/`'published'` hart codieren.
- Laden entweder per `useStoryblok(slug, …)` (mit Live-Preview im Visual Editor) oder `useStoryblokApi().get('cdn/stories/…')`.
- Viele Views nutzen **Top-Level-`await`** in `<script setup>`; das funktioniert nur, weil `App.vue` die Route in `<Suspense>` rendert.
- Ladefehler abfangen und mit `console.error` (deutsche Meldung, Slug nennen) loggen; die Seite soll weiter rendern statt abzustürzen.
- Blöcke aus Storyblok über ein lokales Interface typisieren und per Type Guard auf `component` filtern (siehe `Teams.vue`, `App.vue`).
- Editierbare Elemente bekommen `v-editable="blok"`, damit der Visual Editor sie anklicken kann. In Tests die Direktive stubben: `global: { directives: { editable: () => {} } }`.
- Links aus Storyblok immer über `getUrl()` auflösen; Bilder über `resizeImage`, `imageSrcset`, `imageSize` aus `@/utils/methods` (Storyblok-Image-Service, WebP).
- Teams liegen unter `teams/<slug>`; das Feld `ishd_team` (z. B. `1-herren`) verknüpft ein Team mit ISHD.

### ISHD-Proxy

- Der Browser ruft ISHD nie direkt auf, sondern nur den Proxy (`?typ=spielplan|tabelle&team=1-herren[&saison=YYYY]`).
- **`api/ishd.ts` und `public/api/ishd.php` sind zwei Implementierungen derselben Schnittstelle.** Änderungen an Parametern, Validierung (`TEAM_PATTERN`), erlaubten Origins (`ALLOWED_ORIGINS`) oder am Antwortformat immer in **beiden** Dateien nachziehen.
- Im Dev-Server stellt ein Vite-Plugin (`ishdDevApi` in `vite.config.ts`) `/api/ishd` aus `api/ishd.ts` bereit.
- Eigene Vereins-ID bei ISHD: `OUR_CLUB_ID = 116` (`src/utils/ishd.ts`).
- `useIshd.ts` dedupliziert parallele Anfragen über eine Map; fehlgeschlagene Anfragen werden wieder entfernt.

### Laufschul-Anmeldung

- Formular `src/views/LaufschulAnmeldung.vue` (`/skating/laufschule/anmeldung`) schickt JSON per POST an `public/api/anmeldung.php`; das Skript prüft erneut und verschickt per `mail()` an `EMPFAENGER`.
- Auswahlwerte und Prüfregeln stehen in `src/utils/laufschulAnmeldung.ts` **und** in `anmeldung.php` – immer beide ändern.
- Spam-Schutz: Honeypot-Feld `website` und Rate-Limit pro IP (Hash-Dateien in `public/api/cache/`).
- Im Dev-Server gibt das Vite-Plugin `anmeldungDevApi` Anmeldungen nur in der Konsole aus; auf Vercel gibt es keinen Endpunkt.

### Routing & SEO

- Neue statische Seite: Route in `src/router/index.ts` mit `meta: { title: '…' }` und lazy `component: () => import('@/views/…')`. Die Catch-all-Route `notFound` bleibt die letzte.
- Dynamische Seiten (Artikel, Teams) rufen `setPageMeta()` aus `@/utils/seo` selbst auf.
- Titel/OG-Tags werden clientseitig gesetzt; Social-Media-Vorschauen zeigen daher meist die Defaults aus `index.html`.
- Der Router lädt die Seite bei Chunk-Ladefehlern nach einem Deployment einmal neu (`chunk-reload` in sessionStorage) – nicht entfernen.

## Code-Stil

- Prettier: keine Semikolons, einfache Anführungszeichen, Zeilenbreite 100. 2 Leerzeichen, LF.
- Vue: `<script setup lang="ts">`, Composition API. Einwortige Komponentennamen sind erlaubt.
- Imports über den Alias `@/` → `src/`.
- Styling mit Tailwind-Utility-Klassen direkt im Template. Schriften: `font-sans` (Inter), `font-heading` (Montserrat, auch Default für h1–h3), `font-jersey` (Anton). Eigene Breakpoint-Variante `3xl:` (≥ 1921 px Breite **und** ≥ 1200 px Höhe) für große Bildschirme. Vereinsblau: `#032650`.
- Datums-/Zeitformatierung mit Locale `de-DE`.
- Bevorzugt kleine, reine Helfer in `src/utils/` statt Logik in Templates.
- Kommentare kurz und auf Deutsch, eher das *Warum* erklären.

## Tests

- Vitest mit jsdom, `@vue/test-utils`. Tests liegen in `__tests__/`-Ordnern neben dem Code, Dateiendung `.spec.ts`.
- Testbeschreibungen auf Deutsch (`it('trennt Vor- und Nachname …')`).
- Neue Helfer in `src/utils/` mit Unit-Tests absichern.

## Deployment

- SPA mit History-Routing: der Host muss unbekannte Pfade auf `index.html` umleiten.
  - Vercel: `vercel.json` (Rewrite aller Pfade außer `/api/`, langes Caching für `/assets/`).
  - Apache/Webhoster: `public/.htaccess`; dort läuft der Proxy als `public/api/ishd.php` (Cache-Verzeichnis muss beschreibbar sein, `*.json`/`*.lock`/`*.tmp` darin sind ignoriert).
- Produktions-Domain: `bluearrows.de` / `www.bluearrows.de`; Vercel-Preview: `blue-arrows-sasbach.vercel.app`.
- Node: `^20.19.0 || >=22.12.0`.
