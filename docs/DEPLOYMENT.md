# Deployment Guide - Cloudflare Pages

This guide explains how to deploy your PWA to Cloudflare Pages using GitHub Actions.

## Prerequisites

1. **Cloudflare Account** - Sign up at [cloudflare.com](https://cloudflare.com) (free tier is sufficient)
2. **GitHub Repository** - Your code should be pushed to GitHub

## Setup Instructions

### Step 1: Get Cloudflare Credentials

#### 1.1 Get Account ID

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** in the left sidebar
3. Your Account ID is displayed in the right sidebar
4. Copy the Account ID (format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

#### 1.2 Generate API Token

1. Go to [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Click **Use template** next to "Edit Cloudflare Workers"
4. Or create custom token with these permissions:
   - **Account** → Cloudflare Pages → Edit
   - **User** → User Details → Read
5. Click **Continue to summary** → **Create Token**
6. **Copy the token immediately** (you won't see it again)

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these two secrets:

| Secret Name | Value | Example |
|------------|-------|---------|
| `CLOUDFLARE_API_TOKEN` | Your API token from Step 1.2 | `xxxxx-yyyyyyy-zzzzz` |
| `CLOUDFLARE_ACCOUNT_ID` | Your Account ID from Step 1.1 | `abc123def456...` |

### Step 3: Update Project Name (Optional)

If you want to use a custom project name instead of `pwa-app-template`:

1. Edit `.github/workflows/deploy.yml`
2. Replace `--project-name=pwa-app-template` with your desired name
3. Do the same in `.github/workflows/preview.yml`

```yaml
# Before
command: pages deploy dist --project-name=pwa-app-template

# After
command: pages deploy dist --project-name=my-awesome-pwa
```

### Step 4: Push to Main Branch

```bash
git add .
git commit -m "feat: add Cloudflare Pages deployment"
git push origin main
```

The deployment workflow will automatically trigger.

## What Happens Next

### Production Deployment (main branch)

- **Trigger**: Push to `main` branch
- **Workflow**: `.github/workflows/deploy.yml`
- **Steps**:
  1. Install dependencies
  2. Run tests (must pass)
  3. Build production bundle
  4. Deploy to Cloudflare Pages
- **URL**: `https://<project-name>.pages.dev`

### Preview Deployment (PRs)

- **Trigger**: Open/update Pull Request
- **Workflow**: `.github/workflows/preview.yml`
- **Steps**:
  1. Same as production deployment
  2. Deploy to branch-specific preview
  3. Comment preview URL on PR
- **URL**: `https://<branch-name>.<project-name>.pages.dev`

## Custom Domain (Optional)

After first deployment:

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Select your project
3. Go to **Custom domains** tab
4. Click **Set up a custom domain**
5. Follow the instructions to add DNS records

## Monitoring

### View Deployments

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click on your project
3. View deployment history, logs, and analytics

### GitHub Actions

1. Go to your GitHub repository
2. Click **Actions** tab
3. View workflow runs and logs

## Troubleshooting

### Error: "Authentication error"

**Solution**: Check that your `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are correct.

### Error: "Project not found"

**Solution**: The project will be created automatically on first deployment. If it fails, create the project manually:

1. Go to [Cloudflare Pages](https://dash.cloudflare.com/pages)
2. Click **Create a project**
3. Choose **Direct Upload**
4. Enter project name matching your workflow config

### Error: "Tests failed"

**Solution**: Fix failing tests before deploying. Run `pnpm test` locally to debug.

### Build works locally but fails in CI

**Solution**: Check for:
- Missing dependencies in `package.json`
- Environment-specific code (use `import.meta.env.DEV` checks)
- Node version mismatch (CI uses Node 22)

## Performance Tips

### 1. Enable HTTP/3 (Automatic)

Cloudflare Pages automatically enables HTTP/3 and QUIC for better performance.

### 2. Configure Caching Headers

Create `public/_headers` file:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/sw.js
  Cache-Control: public, max-age=0, must-revalidate

/manifest.webmanifest
  Cache-Control: public, max-age=86400
```

### 3. Enable Analytics

1. Go to your project in Cloudflare Pages
2. Enable **Web Analytics** (free)
3. View Core Web Vitals and visitor data

## Cost

**Free tier includes:**
- Unlimited requests
- Unlimited bandwidth
- 500 builds/month
- 1 build at a time
- Preview deployments

**Pro tier ($20/month):**
- 5,000 builds/month
- 5 concurrent builds
- Advanced analytics

For a PWA like this, **free tier is more than sufficient**.

## Next Steps

- [x] Set up Cloudflare Pages deployment
- [ ] Configure custom domain
- [ ] Enable Web Analytics
- [ ] Set up alerting for failed deployments
- [ ] Optimize caching headers

## Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler GitHub Action](https://github.com/cloudflare/wrangler-action)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
