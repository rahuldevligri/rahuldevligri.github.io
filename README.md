# Rahul Devligri — Backend Engineering Portfolio

A custom, responsive static portfolio for **Rahul Devligri**, focused on Java backend engineering, secure integrations, event-driven services, and data-backed applications.

## Features

- Semantic HTML, custom CSS, and dependency-light JavaScript.
- Responsive layouts for desktop, tablet, and mobile.
- Accessible mobile navigation, visible focus styles, skip link, project filters, and native dialog case studies.
- Reduced-motion support and scroll-reveal animations.
- Original CSS/SVG technical illustrations (no stock-photo filler).
- SEO title, description, canonical URL, Open Graph and Twitter metadata.
- Local resume PDF, favicon, and Open Graph image.
- GitHub Pages-ready root layout and `.nojekyll` marker.

## Local preview

This is a static website; no Node.js build is required.

### Option 1 — open directly

Open `index.html` in a modern browser. For best testing, use a local HTTP server.

### Option 2 — Python server

From this directory:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy to `https://rahuldevligri.github.io/`

The public lookup for `rahuldevligri/rahuldevligri.github.io` returned 404 and no matching public repository was found. No existing repository was changed and no deployment is claimed. If the repository exists privately, use that repository rather than creating a duplicate.

### 1. Create the repository if it does not already exist

On GitHub, choose **New repository** and set:

- **Owner:** `rahuldevligri`
- **Repository name:** `rahuldevligri.github.io`
- **Visibility:** Public
- Leave **Add a README**, `.gitignore`, and license unchecked so the repository starts empty.

Create it. If GitHub says the name already exists, do not create a different repository; open the existing one and use the existing-repository workflow below.

### 2. Push from Windows PowerShell

Extract `Rahul-Devligri-Portfolio.zip`. The project is inside a folder named `rahul-portfolio`. Adjust `$Source` if you extracted it somewhere else. The following commands assume the new GitHub repository is empty:

```powershell
$Source = Join-Path $HOME 'Downloads\Rahul-Devligri-Portfolio\rahul-portfolio'
$Destination = Join-Path $HOME 'Documents\rahuldevligri.github.io'

git clone https://github.com/rahuldevligri/rahuldevligri.github.io.git $Destination
Set-Location $Destination

Copy-Item -Path "$Source\*" -Destination . -Recurse -Force
Copy-Item -LiteralPath (Join-Path $Source '.nojekyll') -Destination '.\.nojekyll' -Force

git branch -M main
git status
git add -A
git commit -m "Build responsive backend engineering portfolio"
git push -u origin main
```

Authenticate with GitHub through your normal Git credential manager if Git requests it. Do not paste access tokens into chat or commit them to the repository.

### Existing-repository workflow

If the repository already has content, first clone it or open the existing local checkout, inspect `git status`, and create a backup branch before copying any files:

```powershell
git status
git switch -c portfolio-refresh-2026
```

Copy the portfolio files into the repository root, inspect `git diff` and `git status`, then commit and push the new branch:

```powershell
git add -A
git commit -m "Build responsive backend engineering portfolio"
git push -u origin portfolio-refresh-2026
```

Review that branch on GitHub before merging it into the default branch. Do not force-push or replace existing files until you have checked whether they contain work worth preserving.

### 3. Enable GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Select **Deploy from a branch**, choose `main`, and choose `/ (root)`; save.
3. Open the **Actions** tab and confirm the Pages deployment finishes successfully.
4. Visit <https://rahuldevligri.github.io/> and hard-refresh the page.

This is plain HTML/CSS/JavaScript in the repository root, so no Node.js build, Vite configuration, or `base` path is required.

## Important accuracy notes

- The employment dates, education entry, and skills are transcribed from the uploaded resume.
- Public project descriptions are based on available GitHub repository READMEs. Professional travel-platform details are résumé-derived and are explicitly marked as professional work; no public source repository or demo is claimed for them.
- There are no invented impact metrics or fabricated live demos.
- The profile avatar loads from the public GitHub avatar URL and has an initials fallback if it fails.
- Update the email, résumé, location, or employment details here if any of the underlying source information changes.

## Files

```text
rahul-portfolio/
├── index.html
├── styles.css
├── script.js
├── README.md
├── robots.txt
├── sitemap.xml
├── .nojekyll
└── assets/
    ├── favicon.svg
    ├── og-card.svg
    ├── og-card.png
    └── Rahul-Devligri-Resume.pdf
```
