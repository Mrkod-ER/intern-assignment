This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup & Local Development

1. Install dependencies:
```bash
npm install
```

2. Environment Variables:
Create a `.env.local` file in the root of the project with your Gemini API key:
```env
GEMINI_API_KEY="your_google_gemini_api_key"
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Assignment Requirements Implemented

- **UI & Architecture**: `layout.tsx` wrapper with a left Sidebar and a Topbar search interface. Clean UI styling matching modern SaaS interfaces.
- **Discover Companies (`/companies`)**: Browse and search Mock Data with functioning Industry filters and pagination. Includes quick actions for creating lists or saving searches.
- **Persistent State (`store.ts`)**: Zustand + LocalStorage is used to maintain User Lists, User Saved Searches, and Company-specific Notes.
- **Company Profile (`/companies/[id]`)**: Detailed profile view showcasing timeline, dynamic actions, and the Live Enrichment portal. Users can freely save to custom lists and write persisting notes.
- **Live AI Scrape API (`/api/enrich`)**: 
  - On demand server-side route.
  - Passes the target domain to `r.jina.ai` to extract the full markdown representation of the website without blocking.
  - Prompts `gemini-2.5-flash` to extract a succinct JSON representation matching the assigned schema (Summary, What They Do, Keywords, Derived Signals).
