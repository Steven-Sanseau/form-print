# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Vue 3 application that generates human-readable, print-friendly overviews of Typeform surveys. It allows users to either upload Typeform JSON definitions or load them directly from URLs via the Typeform API. The application processes the survey structure and displays all fields, choices, and conditional logic in a format that can be saved as PDF.

**Live Demo:** https://typeform-print.netlify.app

## Development Commands

### Start Development Server
```sh
npm run dev
```
Starts Netlify Dev server (includes serverless functions and Vite dev server). This is the primary development command as it enables the URL loading feature through the Netlify Function proxy.

Alternative Vite-only mode (without URL loading feature):
```sh
npm run dev:vite
```

### Testing
```sh
npm run test:unit          # Run tests in watch mode
npm run test               # Run lint + tests (CI mode)
```
Tests are powered by Vitest with jsdom environment. Test files are co-located with source files using `.test.js` suffix.

### Build and Preview
```sh
npm run build              # Production build
npm run preview            # Preview production build
```

### Linting
```sh
npm run lint               # Auto-fix with ESLint
```

### Bulk Loading (Server-side)
```sh
npm run load-surveys       # Requires TYPEFORM_PERSONAL_ACCESS_TOKEN in .env
```

## Architecture

### Data Flow

1. **Input Sources**
   - File upload: JSON files from Typeform API or data export
   - URL loading: Direct fetch via Typeform API (proxied through Netlify Function)

2. **Processing Pipeline** (`src/utils/processData.js`)
   - Parses raw Typeform JSON structure
   - Generates hierarchical field references (`fieldShortName`)
   - Creates choice identifiers (`choiceShortName`)
   - Builds logic condition text (`logicText`)
   - Constructs field reference lookup map for logic resolution

3. **Rendering** (Vue components)
   - `App.vue`: Main container, handles loading and error states
   - `FormField.vue`: Recursive component for fields and groups
   - `FieldHeader.vue`: Field title and metadata display
   - `FieldChoice.vue`: Individual choice rendering

### CORS Proxy Pattern

The Typeform API doesn't support CORS, so direct browser requests fail. The solution:

- **Netlify Function** (`netlify/functions/typeform-proxy.js`): Server-side proxy that fetches from Typeform API
- **Client Function** (`src/utils/fetchTypeform.js`): Makes requests to `/.netlify/functions/typeform-proxy`
- **URL Parser** (`src/utils/parseTypeformUrl.js`): Extracts form IDs from various URL formats

This approach keeps API tokens secure (server-side only) and works without browser extensions.

### Key Utilities

- `processData.js`: Core data transformation - adds shortNames, builds field lookup, processes logic
- `logicText.js`: Converts Typeform logic JSON into human-readable text
- `conditionText.js`: Formats individual logic conditions
- `actionDetailsText.js`: Formats logic action details
- `markdown.js`: Renders markdown in field descriptions using snarkdown

### Field Reference System

Fields are assigned hierarchical short names for readability:
- Top-level: `1`, `2`, `3`...
- Nested (groups): `1.1`, `1.2`, `2.1`...

Choices use letter identifiers: `A`, `B`, `C`...

These references are used throughout the logic text to make conditional flows readable.

### Environment Variables

**Client-side** (`.env` with `VITE_` prefix):
- `VITE_TYPEFORM_TOKEN`: Optional, pre-fills API token in UI

**Server-side** (`.env`):
- `TYPEFORM_PERSONAL_ACCESS_TOKEN`: Required for `load-surveys` script

Token priority: Environment variable > localStorage > user input

## Tech Stack

- **Framework**: Vue 3 (Composition API with `<script setup>`)
- **Build Tool**: Vite 3
- **Styling**: Tailwind CSS (with print-specific utilities)
- **Testing**: Vitest + Vue Test Utils + jsdom
- **Deployment**: Netlify (with serverless functions)
- **Markdown**: snarkdown (lightweight markdown parser)

## Node Version

This project uses **Node.js 22.21.1** (managed via Volta). Always use this version for consistency.

## Important Patterns

### Recursive Group Rendering

FormField.vue recursively renders itself for `type: "group"` fields, creating nested field hierarchies.

### Print Styling

Components use Tailwind's `print:` variants for PDF generation:
- `print:hidden`: Hide UI elements (upload form, buttons)
- `print:whitespace-pre-wrap`: Prevent logic text overflow
- `print-no-break`: Custom class to prevent page breaks inside fields

### Example Data

The app loads example data from `data/XrH6qm0B - Example typeform.json` on startup to demonstrate functionality.

## Git Workflow

- Main branch: `main`
- Netlify auto-deploys from main branch
- Recent work: Netlify Functions setup, URL loading feature, Node version updates
