# April's Grimoire

A dark-academia / witchy personal website for April, built with React + Vite.

- **Live site:** https://apriljwalter-lgtm.github.io/april/
- **Repository:** https://github.com/apriljwalter-lgtm/april

## Run it locally

```sh
npm install
npm run dev      # http://localhost:5173/april/
npm run build    # production build into dist/
npm run lint
```

## Deployment

The site is hosted on GitHub Pages from the `main` branch. Every push to `main`
runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which lints,
builds, and publishes `dist/` to Pages.

One-time setup: in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions**.

If the repository is ever renamed, update `base` in [`vite.config.js`](vite.config.js)
to match the new repo name.

## Editing content

All personal details (work, goals, hobbies, books, bands, colors) live in
[`src/data/profile.js`](src/data/profile.js). Each section component in
`src/components/` reads from that file, so most updates don't require touching JSX.
