# Deployment Instructions

## Quick Deploy Commands:

```bash
# 1. Login to Vercel (opens browser)
vercel login

# 2. Deploy with specific project name
vercel --prod --name clinical-intelligence

# 3. If you need to redeploy later
vercel --prod
```

## Alternative: Deploy via Git

1. Push this repository to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import from GitHub
5. Set project name to `clinical-intelligence`
6. Deploy

## Environment Variables (if needed)

If you need to set environment variables:

```bash
# Set environment variables
vercel env add VITE_MODE
# Enter: demo (or live if you have API keys)

vercel env add VITE_MINO_API_KEY
# Enter your API key if using live mode
```

## Final URL
Your demo will be available at: `https://clinical-intelligence.vercel.app`

## Custom Domain (Optional)
If you have a custom domain, you can add it in:
Vercel Dashboard → Project → Settings → Domains