# 🧮 Opis projektu aero-404 — szczegółowe omówienie


## 🔹 🚀 Działające demo

 - Frontend **wdrożony produkcyjnie:**  [https://404-areo.netlify.app/](https://404-areo.netlify.app/) 
 - Backend **wdrożony produkcyjnie:** [https://aero-404.onrender.com](https://aero-404.onrender.com)
 - Dokumentacja backendu dostępna **w przyjaznej formie** [Swagger doc](https://aero-404.onrender.com/swagger-ui/index.html)

## 🔹 🤖 Spryt Agentic AI

Claude Code v2.1.89 Opus 4.6 (1M context) with medium effort · Claude Team

### Pluginy
- context7 · claude-plugins-official
- playwright Browser automation and end-to-end testing

### Agents

- Agent do przeszukiwania dokumetacji `tools: WebFetch, WebSearch, Skill, MCPSearch`, kryteria uzycia: Context7, docs/llms.txt, 

### Skills

- web-security (Wymuszanie bezpieczeństwa webowego i unikanie podatności)
-  angular-developer (Generowanie kodu Angular i wskazówki architektoniczne komponenty, sygnały, routing, SSR, testy, CLI — autor: Google) `angular-animations`, `angular-aria`, `cli`, `component-harnesses`, `components`, `component-styling`, `creating-services`, `data-resolvers`, `define-routes`, `defining-providers`, `di-fundamentals`, `e2e-testing`, `effects`, `hierarchical-injectors`, `host-elements`, `injection-context`, `inputs`, `linked-signal`, `loading-strategies`, `mcp`, `navigate-to-routes`, `outputs`, `reactive-forms`, `rendering-strategies`, `resource`, `route-animations`, `route-guards`, `router-lifecycle`, `router-testing`, `show-routes-with-outlets`, `signal-forms`, `signals-overview`, `tailwind-css`, `template-driven-forms`, `testing-fundamentals`

### Commands

- komenda do refaktoryacji kodu /szukaj-i-popraw BUG,SECURITY 

### MCP
- angular-cli
- context7
- playwright

### Plik `.claude/settings.json`
 ```json
{
  "sandbox": {
    "enabled": true,
    "autoAllowBashIfSandboxed": true
  }
}
 ```

## 🔹 🎯 Zrozumienie problemu

 [z User Stories](https://github.com/PSE-Innowacje/hackathon-agentic-coding/blob/master/specs/AERO%20PRD.md#5--user-stories) zaplanowano testy e2e. Każda z 9 historii użytkownika (a–i) została przetestowana jako osobny scenariusz end-to-end z wykorzystaniem odpowiedniej roli użytkownika.

**Narzędzia:**
- Playwright MCP Plugin (browser_navigate, browser_snapshot, browser_click, browser_fill_form, browser_file_upload, browser_console_messages, browser_evaluate)
- Claude Code (Opus 4.6) — analiza wyników, porównanie z wymaganiami projektu

**Środowisko:**
- Serwer deweloperski: `http://localhost:3000`
- Backend API: `https://aero-404.onrender.com`
- Przeglądarka: Chromium (Playwright)
- Plik KML do testów: `test-e2e/PRZYKLADOWA-TRASA-wroclaw-krakow.kml`

uzyto przygotowanych kont dla każdej roli uzytkowników [z tabeli](./frontend/test-e2e/LOGINY.MD)

### Wiosek

| Kategoria | PASS | FAIL | 
|-----------|:----:|:----------------:|
| User Stories | 9 | 0 |

**Wniosek:** poprawnie zaimplementowano wszystkie 9 User Stories ze specyfikacji. 

## 🔹 💡 Potencjał biznesowy

wykonano **wszystko** opsiane [w spedyfikacji projektu](https://github.com/PSE-Innowacje/hackathon-agentic-coding/blob/master/specs/AERO%20PRD.md). Walidacja po stronie backnedu i frontedu dla kazdej roli użytowika, osobne akcje i widoki.

Aplikacja podparta testami jednostkowymi oraz e2e. 

## 🔹 🏗️ Architektura aplikacji

## Frontend

- **Angular 21** (standalone components, signals, strict mode)
- **Ionic 8** for UI components
- **OpenLayers** (`ol`) for map visualization and KML handling
- **SCSS** for styles
- **Vitest + jsdom** for testing
- **Prettier** (100 char width, single quotes, angular HTML parser)

## Backend

- **@todo**

## 🔹 ⭐ Dodatkowo - poza zakresem

 - Działająca wersja w przeglądarce na desktopie, tablecie, telefonie **(Responsive Web Design)**
 - Automatyczne wyliczanie szacowanej długości zlecenia przelotu
 - Pokazywanie trase zlecenia na mapie
 - Możliwośc ustalenia pozycji lotniska bezpośrednio na mapie
 - Aplikacja opublikowana jako **aplikacja Andorida**, gotowe paczki do pobrania: [Instal.APK](./frontend/android/app/release/app-release.apk) lub [Release.AAB](./frontend/android/app/release/app-release.aab) 
