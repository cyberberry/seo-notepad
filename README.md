# The SEO Notepad

AI-powered web app for generating SEO blog titles, meta descriptions, and article outlines from a target keyword, tone, audience, and language.

Built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and the **OpenAI API**.

## Features

- **Bento-style UI** with motion (Framer Motion) and a sky/zinc design system
- **Structured output**: titles, meta descriptions, and outline sections (heading + bullets)
- **Copy on click** for any result row (toast confirmation via Sonner)
- **Validated API**: Zod request validation and model JSON shape checks before data reaches the UI

## Tech stack

| Layer | Tools |
|--------|--------|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4, Lucide icons, Framer Motion |
| AI | OpenAI Chat Completions (`json_object` response format) |
| Validation | Zod |
| Logging | [Pino](https://getpino.io/) (+ [pino-pretty](https://github.com/pinojs/pino-pretty) in development) |
| Toasts | Sonner |

## Prerequisites

- **Node.js** 20+
- **npm** (or pnpm / yarn)
- An [OpenAI API key](https://platform.openai.com/api-keys)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local` in the project root:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4.1-mini
```

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `OPENAI_MODEL` | Yes | Model id (e.g. `gpt-4.1-mini`, `gpt-4o-mini`) |
| `LOG_LEVEL` | No | `debug` \| `info` \| `warn` \| `error` (default: `debug` in dev, `info` in production) |

Do not commit `.env.local` or any file containing secrets.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Project structure

```
app/
  page.tsx              # Server Component — layout shell + backgrounds
  layout.tsx            # Root layout, metadata, Toaster
  api/generate/route.ts # POST handler for generation
  globals.css
components/
  HomePageClient.tsx    # Client island — state, hero, form, results
  KeywordForm.tsx       # Input form + fetch to API
  ResultsPanel.tsx      # Tabs, animated lists, copy-on-click
  ui/sonner.tsx
lib/
  logger.ts             # Server Pino logger (`createLogger`, server-only)
  client-logger.ts      # Browser Pino logger for client components
  openai.ts             # OpenAI client + generation (server-only)
  prompts.ts            # System and user prompt builders
  seo-schemas.ts        # Zod schemas + JSON parsing helpers
types/
  index.ts              # Shared TypeScript types
```

## API

### `POST /api/generate`

Generates SEO content for the given inputs.

**Request** (`Content-Type: application/json`):

```json
{
  "keyword": "content marketing",
  "tone": "professional",
  "audience": "marketers",
  "language": "us-english",
  "titleCount": 5,
  "metaCount": 5,
  "sectionCount": 5
}
```

| Field | Required | Notes |
|-------|----------|--------|
| `keyword` | Yes | 1–500 characters |
| `tone` | No | Max 120 characters |
| `audience` | No | Max 120 characters |
| `language` | No | Defaults to `English (US)` in the handler |
| `titleCount` | No | 1–15, default `5` |
| `metaCount` | No | 1–15, default `5` |
| `sectionCount` | No | 1–20, default `5` |

Extra keys are rejected (`.strict()` schema).

**Success** `200`:

```json
{
  "content": {
    "titles": ["..."],
    "metaDescriptions": ["..."],
    "outlineSections": [
      { "heading": "...", "bullets": ["...", "..."] }
    ]
  }
}
```

## License

Private project — all rights reserved unless stated otherwise by the owner.
