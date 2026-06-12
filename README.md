# For Sagarika, From Pranjal

A private, cinematic React love-story website built with Vite, Tailwind CSS, and Motion for React.

## Local Development

```bash
npm install
npm run dev
```

The password is stored only in local React state. Change it in `src/data/content.js`.

## Editing The Story

Most text, dates, letters, reasons, receipt captions, and image paths live in:

```text
src/data/content.js
```

Replace photos by swapping files in:

```text
public/images
```

## Build

```bash
npm run build
```

The production build uses `/sagarika/` as its base path for GitHub Pages.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` deploys `dist` after every push to `main`.

Expected URL:

```text
https://<github-username>.github.io/sagarika/
```

Private-repo GitHub Pages requires a GitHub plan that supports Pages for private repositories. If that is not available, make the repository public or use another static host.
