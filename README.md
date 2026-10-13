# my-site

Personal blog, projects, and photography, built with [Zola](https://www.getzola.org) 0.23.

## Local development

    zola serve        # http://127.0.0.1:1111 with live reload
    zola build        # outputs to public/

## Where things live

- `content/blog/` — posts (Markdown). For posts with images, use a folder with `index.md`.
- `content/projects/` — one page per project; `repo`/`demo` links go under `[extra]`.
- `content/photos/<album>/` — an `index.md` plus image files; thumbnails are generated at build time.
- `templates/` — Tera v2 templates; reusable pieces are in `templates/components.html`.
- `static/css/style.css` — all styling. Font: [Paper Mono](https://github.com/paper-design/paper-mono) (OFL).
- `static/js/` — optional scripts. Add `scripts = ["file.js"]` under `[extra]` in a page to load one.

## Deploying

Pushing to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yml`.
