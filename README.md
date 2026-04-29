# Amazing-Grace
Welcome to Amazing Grace Home Living. Providing secure, all-inclusive housing in Tampa and Largo

## Site Sections

### 🏠 Home / Listings (`/`)
The main homepage featuring property listings for Amazing Grace Home Living.

### 🎮 Arcade (`/arcade/`)
The Nexus Arcade hub — play faith-based games including **Mystery of the Seven Stars** and **Match Maker**.

- URL: `https://amazinggracehl.org/arcade/`
- Tracks level progress via `progression.js` (localStorage-backed)
- Displays a 7-star progress map updated on each Match Maker level completion
- Certificate viewer: `https://amazinggracehl.org/arcade/certificates/`

### ✝️ Ministry (`/ministry/`)
Faith-based content and ministry resources.

### 🗺️ Galleries (`/galleries/`)
Photo galleries for individual properties.

---

## ⚠️ Admin Dashboard (`/admin/`) — Experimental

> **Not linked in primary navigation.** This section is intentionally off-nav and isolated
> so that login prompts, 404s, or experimental features do not affect the main site.

The Sovereign Matrix Admin Dashboard provides browser-based tooling for user management,
audit logging, diagnostics, and admin key generation. It uses a localStorage shim for
demo/dev use and is designed to be upgraded to Firebase Auth in production.

- URL: `https://amazinggracehl.org/admin/`
- Login: `https://amazinggracehl.org/admin/login.html`
- **Demo accounts** (active on `localhost` / `*.github.io` only):
  - `owner@matrix.dev` / any password (4+ chars)
  - `superadmin@matrix.dev` / any password
  - `admin@matrix.dev` / any password
- On production (`amazinggracehl.org`), live Firebase Auth must be configured in
  `public/admin/js/auth.js` before the admin login will work.

