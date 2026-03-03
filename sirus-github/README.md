# Progetto Sirus — Trading Assistant

App di trading Forex integrata con Capital.com e AI Claude.

## Deploy su Cloudflare Pages

1. Crea account su [cloudflare.com](https://cloudflare.com)
2. Pages → Create project → Connect to Git → seleziona questo repo
3. Build settings: lascia tutto vuoto (nessun build command)
4. Settings → Environment variables → aggiungi `ANTHROPIC_API_KEY`
5. Redeploy → apri il tuo URL `.pages.dev`
