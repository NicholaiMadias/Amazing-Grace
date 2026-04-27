# ✅ Deployment Checklist — Amazing Grace Home Living

## Phase 1 — Domain & DNS

- [ ] `amazinggracehl.org` resolves and returns HTTPS 200

GitHub Pages A records required:

```
A @ → 185.199.108.153
A @ → 185.199.109.153
A @ → 185.199.110.153
A @ → 185.199.111.153
CNAME www → nicholaimadias.github.io
```

CNAME file at repo root must contain `amazinggracehl.org`.

## Phase 2 — GitHub Actions Workflows

- [ ] **deploy.yml** — builds and deploys the site to GitHub Pages on every push to `main`

## Phase 3 — Post-Deploy Verification

- [ ] Visit `https://amazinggracehl.org` — home page loads
- [ ] Visit `https://amazinggracehl.org/listings/` — listings hub shows the three rental properties
- [ ] Visit `https://amazinggracehl.org/arcade/` — arcade page loads
- [ ] Verify CNAME file is present in `dist/` after build
