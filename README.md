# Content Engine

Private content generation app for Leon Charles — Unfiltered + Coaching.

## Setup

1. Install dependencies
```
npm install
```

2. Create your environment file
```
cp .env.example .env.local
```

3. Add your Anthropic API key to `.env.local`
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

4. Add your logo
Place your logo image at `public/logo.png`

5. Run the app
```
npm run dev
```

6. Open in browser
```
http://localhost:3000
```

## Build for production

```
npm run build
npm run start
```

## Deploy to Vercel

1. Push to GitHub
2. Connect repo in Vercel dashboard
3. Add `ANTHROPIC_API_KEY` in Project Settings → Environment Variables
4. Deploy
