# Amazing Grace Home Living — Site Governance

**Production domain:** amazinggracehl.org
**Repo:** NicholaiMadias/Amazing-Grace
**Pages:** https://nicholaimadias.github.io/Amazing-Grace/

---

## Site Sections

- 🏠 **Listings** — `amazinggracehl.org/`
- 🎮 **Arcade** — `amazinggracehl.org/arcade/`
- ✝️ **Ministry** — `amazinggracehl.org/ministry/`

---

## ✅ Governance Enhancements

### 1️⃣ 🔐 Signed Content Validation
Ensure site content and agent instructions are authentic and untampered.
- Sign ministry artifacts (sermon updates, governance rules) with GPG or Ed25519.
- CI step example: `gpg --detach-sign --armor Agent.Instructions.pdf`
- Reject unsigned or invalid signatures; log results.

### 2️⃣ 📣 Uptime & Outreach Alerts
Treat site downtime as a mission disruption.
- Outages for `amazinggracehl.org` trigger email and dashboard alerts.
- Example payload:
  ```json
  {
    "domain": "amazinggracehl.org",
    "severity": "critical",
    "category": "outreach",
    "status": "down"
  }
  ```

### 3️⃣ 🌐 Public Site Health Badge
Provide public transparency via a status badge.
- ✅ Green: Site UP
- ❌ Red: Site DOWN
- 🟡 Yellow: Degraded
- Badge URL: `https://amazinggracehl.org/health/badge.svg` *(planned future enhancement)*

### 4️⃣ 🧠 AI‑Generated Incident Summaries
Turn incidents into learning artifacts.
- On outage: collect logs → AI generates root cause, timeline, and remediation steps.
- Store summaries in an audit log or `/reports/` folder.

---

## ✅ Deployment Checklist

### Phase 1 — Domain & DNS
- [ ] `amazinggracehl.org` resolves and returns HTTPS 200
- [ ] `www.amazinggracehl.org` redirects to apex
- [ ] GitHub Pages CNAME file contains `amazinggracehl.org`

### Phase 2 — Secrets & Credentials
- [ ] (Optional) `GEMINI_API_KEY` configured in repo secrets

### Phase 3 — GitHub Actions
- [ ] `deploy.yml` triggers on push to `main`
- [ ] `cloudflare-pages-preview-comment.yml` posts preview URLs to PRs
- [ ] `domain-monitor.yml` scheduled check passes for `amazinggracehl.org`

### Phase 4 — Data Flow
- [ ] GitHub Actions build succeeds (`npm run build`)
- [ ] Dist artifacts deployed to GitHub Pages
- [ ] Cloudflare Pages preview URLs posted automatically on PRs
