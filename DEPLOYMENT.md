# ✅ Deployment Checklist — Tri-Domain Health & Agent Sync

## Phase 1 — Domains & DNS

- [ ] `nicholai.org` resolves and returns HTTPS 200
- [ ] `amazinggracehomeliving.com` resolves and returns HTTPS 200
- [ ] `voiceofjesusministry.org` resolves and returns HTTPS 200

All three domains require GitHub Pages A records:

```
A @ → 185.199.108.153
A @ → 185.199.109.153
A @ → 185.199.110.153
A @ → 185.199.111.153
CNAME www → nicholaimadias.github.io
```

## Phase 2 — Secrets & Credentials

Configure the following in **GitHub → Settings → Secrets → Actions**:

| Secret | Purpose | Required? |
|--------|---------|-----------|
| `MINISTRY_GPG_PUBLIC_KEY` | ASCII-armored GPG public key for ministry content signing | Optional |
| `GEMINI_API_KEY` | Google Gemini API key for AI incident summaries | Optional |

> **Content signing setup:** Generate a signing key pair locally with
> `gpg --gen-key`, export the public key with
> `gpg --armor --export YOUR_KEY_ID`, and paste the result into the
> `MINISTRY_GPG_PUBLIC_KEY` secret. Sign your ministry content manifest with
> `gpg --detach-sign --armor content-manifest.txt` and publish both
> `content-manifest.txt` and `content-manifest.txt.asc` to the root of
> `voiceofjesusministry.org`.

## Phase 3 — GitHub Actions Workflows

- [ ] **deploy.yml** — builds and deploys the site to GitHub Pages on every push to `main`
- [ ] **tri-domain-monitor.yml** — scheduled health monitor (every 30 minutes) covering:
  - Domain reachability for all three domains
  - Ministry domain treated as `⚠️ CRITICAL (outreach)` — workflow fails when it is down
  - Ministry content integrity check (keyword verification)
  - Ministry content signature verification (requires `MINISTRY_GPG_PUBLIC_KEY` secret)
  - AI-generated incident summary on ministry outage (requires `GEMINI_API_KEY` secret)

## Phase 4 — Health Badge

The tri-domain monitor workflow exposes a live status badge. Add it to any page:

```markdown
[![Ministry Health](https://github.com/NicholaiMadias/Amazing-Grace/actions/workflows/tri-domain-monitor.yml/badge.svg)](https://github.com/NicholaiMadias/Amazing-Grace/actions/workflows/tri-domain-monitor.yml)
```

Badge meanings:
- 🟢 **passing** — all domains reachable, ministry content verified
- 🔴 **failing** — ministry domain is down or content check failed

## Phase 5 — Post-Deploy Verification

- [ ] Visit `https://amazinggracehomeliving.com` — home page loads
- [ ] Visit `https://amazinggracehomeliving.com/ministry` — ministry page loads
- [ ] Visit `https://amazinggracehomeliving.com/arcade` — arcade page loads
- [ ] Visit `https://amazinggracehomeliving.com/ministries/` — Seven Stars page loads
- [ ] Trigger **tri-domain-monitor** manually via workflow_dispatch and confirm the Step Summary table renders correctly
- [ ] Verify CNAME file is present in `dist/` after build (`amazinggracehomeliving.com`)

## Phase 6 — Content Signing (Optional but Recommended)

- [ ] Generate GPG key pair for ministry content
- [ ] Add `MINISTRY_GPG_PUBLIC_KEY` secret to the repository
- [ ] Create `content-manifest.txt` listing SHA256 hashes of key ministry files
- [ ] Sign with `gpg --detach-sign --armor content-manifest.txt`
- [ ] Publish `content-manifest.txt` and `content-manifest.txt.asc` to `voiceofjesusministry.org`
- [ ] Trigger monitor and confirm "✅ Valid" signature result in Step Summary

## Phase 7 — AI Incident Summaries (Optional)

- [ ] Obtain a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
- [ ] Add `GEMINI_API_KEY` secret to the repository
- [ ] Trigger a manual failure (take voiceofjesusministry.org offline briefly) to test AI summary output in the Actions Step Summary
