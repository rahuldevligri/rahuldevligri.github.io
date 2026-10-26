# Rahul Devligri — Backend Engineering Portfolio

A custom, responsive portfolio for **Rahul Devligri**, a Java backend engineer focused on secure identity, event-driven services, backend integrations, and maintainable data-driven systems.

Live website: <https://rahuldevligri.github.io/>

## Design and experience

- Dark, editorial visual system with electric-cyan, blue, and violet accents.
- Animated hero headline, subtle atmospheric glow, moving system paths, scroll progress, and section-reveal transitions.
- Interactive architecture map with three modes: SAML SSO, Kafka event flow, and a SpEL-based travel policy workflow.
- Seven selected projects/case studies, including the textile ERP work documented in the résumé.
- Experience timeline, education, structured skill groups, and public DSA/Java learning trail.
- Collapsible list of foundational courses and badges found on the public LinkedIn profile.
- Mobile navigation, project filters, native case-study dialogs, visible keyboard focus, and reduced-motion support.
- No front-end framework or runtime dependency; animations are CSS/vanilla JavaScript.
- SEO metadata, Person JSON-LD, Open Graph/Twitter metadata, favicon, sitemap, and `robots.txt`.
- Original avatar is loaded from the public GitHub profile; no synthetic face or stock imagery is used.

## Local preview

The site is plain HTML/CSS/JavaScript. No Node installation or production build is required.

From this directory run:

```powershell
py -m http.server 8000
```

Then open <http://localhost:8000/>.

You can also open `index.html` directly, but a local HTTP server gives a more realistic page environment.

## Deploy the refresh to GitHub Pages

The site is deployed from the root of the `main` branch in `rahuldevligri/rahuldevligri.github.io`. Before replacing files, create a local backup/rollback branch and verify the working tree.

```powershell
$Destination = Join-Path $HOME 'Documents\rahuldevligri.github.io'
$Source = 'D:\Downloads\Rahul-Devligri-Portfolio-Redesign-V2\rahul-portfolio'

Set-Location $Destination
git status --short --branch
git switch -c portfolio-redesign-v2

Copy-Item -Path "$Source\*" -Destination $Destination -Recurse -Force
Copy-Item -LiteralPath "$Source\.nojekyll" -Destination "$Destination\.nojekyll" -Force

git status --short
git diff --stat
git add -A
git commit -m "Refresh backend engineering portfolio with interactive systems map"
git push -u origin portfolio-redesign-v2
```

Review the branch at GitHub and merge it into `main` when satisfied; GitHub Pages will deploy the merged commit. If you prefer deploying directly from `main`, create a rollback branch before copying, then commit and push to `main`. Do not force-push.

After merging, confirm the `pages build and deployment` workflow succeeds and visit <https://rahuldevligri.github.io/>. Hard-refresh with `Ctrl+F5` if the browser shows cached CSS.

## Content accuracy

- Employment dates, responsibilities, education, and the 48+ loom figure are based on the uploaded résumé.
- Public project descriptions use the relevant GitHub repository README/source descriptions.
- LinkedIn was inspected through publicly indexed content. Direct profile inspection was restricted, so the credential list is marked as items shown on the public LinkedIn profile rather than independently verified certificates.
- Professional work at Zaggle and SJLT is marked as professional/internal work. No private source code, internal customer data, invented live demos, or unsupported results are claimed.
- The architecture map is an illustrative explanation of engineering patterns, not a claim that every project uses one identical production topology.

## Project structure

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
