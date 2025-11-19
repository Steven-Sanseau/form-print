# Typeform overview

**Live Demo:** [https://typeform-print.netlify.app](https://typeform-print.netlify.app)

Typeform does not yet have a (exportable) overview of the full survey definition / content. To share the underlying logic people need to be granted edit rights.
This project allows you to generate a human-readable overview of your Typeform surveys. This overview can then be saved as PDF.
It hopefully provides an answer to this [community question](https://community.typeform.com/build-your-typeform-7/is-it-possible-to-export-the-form-content-questions-choices-logics-not-the-result-in-pdf-or-excel-1062).

## Features

### 🔗 Load from URL (NEW!)
Simply paste any Typeform URL and load it directly:
- Example: `https://4xmr70ckan3.typeform.com/to/Gjl34w73`
- Or just the form ID: `Gjl34w73`
- Works with public forms without any authentication
- For private forms, provide an optional API token

### 📤 Upload JSON
Upload a JSON file exported from Typeform via:
- The [Typeform API](https://www.typeform.com/developers/create/reference/retrieve-form/)
- The [Request data function](https://www.typeform.com/help/a/data-portability-360029616371/)

### 🖨️ Print-friendly
Generate a clean overview that can be saved as PDF using your browser's print function.

## Project Setup

```sh
npm install
```

### Loading survey definitions through API (Server-side script)

For bulk loading of forms, supply `TYPEFORM_PERSONAL_ACCESS_TOKEN` in an `.env` file (see `.env.example`).

```sh
npm run load-surveys
```

**Note:** The web interface can load forms directly without an API token for public forms. The token is only required for private forms or when using the bulk load script.

### Compile and Hot-Reload for Development

To develop locally with Netlify Functions support (required for the URL loading feature):

```sh
npm run dev
```

This will start the Netlify Dev server which includes the Typeform API proxy function.

Alternatively, for Vite-only development (without URL loading):

```sh
npm run dev:vite
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Printing to PDF

The application is optimized for printing and PDF export. To get the best results:

### Browser Print Settings

1. **Chrome/Edge:**
   - Open Print dialog (Ctrl/Cmd + P)
   - Destination: "Save as PDF"
   - **IMPORTANT:** Uncheck "Headers and footers" to remove date/URL
   - Layout: Portrait
   - Margins: Default or Minimum

2. **Firefox:**
   - Open Print dialog (Ctrl/Cmd + P)
   - **IMPORTANT:** In "More settings", uncheck "Print headers and footers"
   - Margins: Default or None

3. **Safari:**
   - Open Print dialog (Cmd + P)
   - Click "Show Details"
   - **Uncheck "Print headers and footers"** at the bottom

### Print Optimizations

The application automatically:
- ✅ Hides the loader interface
- ✅ Removes unnecessary spacing
- ✅ Prevents question blocks from being split across pages
- ✅ Optimizes margins for better content density
- ✅ Removes box shadows and UI decorations

## Technical Details

### CORS and API Proxy

The Typeform API doesn't support CORS for browser-based requests. To work around this, the application uses a Netlify Function (`netlify/functions/typeform-proxy.js`) that acts as a server-side proxy:

1. The frontend makes a request to `/.netlify/functions/typeform-proxy?formId=xxx`
2. The Netlify Function makes the actual API request to Typeform server-side
3. The response is returned to the frontend with proper CORS headers

This approach:
- ✅ Avoids CORS issues
- ✅ Works without CORS browser extensions
- ✅ Keeps API tokens secure (they never leave the server)
- ✅ Supports both public and private forms

## ToDo's

- Link fields and choices in logic the their fields and choices through anchors
- Support more question types
- Fix issues with \*'s in texts
