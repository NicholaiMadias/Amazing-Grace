# Amazing-Grace

[![Deploy to GitHub Pages](https://github.com/NicholaiMadias/Amazing-Grace/actions/workflows/deploy.yml/badge.svg)](https://github.com/NicholaiMadias/Amazing-Grace/actions/workflows/deploy.yml)
[![Ministry Health](https://github.com/NicholaiMadias/Amazing-Grace/actions/workflows/tri-domain-monitor.yml/badge.svg?label=Ministry+Health)](https://github.com/NicholaiMadias/Amazing-Grace/actions/workflows/tri-domain-monitor.yml)

Welcome to Amazing Grace Home Living. Providing secure, all-inclusive housing in Tampa and Largo.

## Tri-Domain Governance

This repository governs three domains:

| Domain | Purpose | Severity |
|--------|---------|----------|
| `amazinggracehomeliving.com` | Listings & housing | Standard |
| `nicholai.org` | Arcade & gamified learning | Standard |
| `voiceofjesusministry.org` | Ministry outreach | ⚠️ Critical |

A [scheduled GitHub Actions workflow](.github/workflows/tri-domain-monitor.yml) monitors all three domains every 30 minutes with:
- Ministry-priority alerting (outage fails the workflow immediately)
- Content integrity checks on the ministry domain
- Optional GPG-signed content manifest verification (`MINISTRY_GPG_PUBLIC_KEY` secret)
- Optional AI-generated incident summaries on ministry outage (`GEMINI_API_KEY` secret)

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full deployment checklist and setup guide.
