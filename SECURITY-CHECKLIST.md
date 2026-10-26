# Portfolio repository: security hardening checklist

This is a static GitHub Pages site. The quality workflow checks site integrity and scans Git history for accidental secrets; it does not deploy the site.

## One-time GitHub settings

1. Open `https://github.com/rahuldevligri/rahuldevligri.github.io/settings/security_analysis` while signed in as the repository owner.
2. Under **Secret scanning**, verify that public-repository secret scanning is enabled and review any existing alerts. Public repositories receive secret scanning for free; feature labels may change in GitHub's UI.
3. Enable **Push protection** if the toggle is available. It helps block supported secrets before they are pushed.
4. Open **Settings → Actions → General** and keep workflow permissions at **Read repository contents permission** unless a workflow has a documented need for more. Do not enable write-all permissions.
5. Open **Actions** and verify the `Portfolio quality and secret scan` workflow completes successfully after the new files are pushed.

## What this workflow does not do

- It does not change GitHub Pages publishing settings or deploy from Actions.
- It cannot set HTTP response headers such as Content-Security-Policy, X-Frame-Options or Strict-Transport-Security for GitHub Pages. Those controls require hosting/CDN support; do not assume that adding a `headers` file configures them on GitHub Pages.
- Secret scanning cannot guarantee detection of every credential. Never commit API keys, passwords, private certificates, customer data, or `.env` files.

## If a real secret is detected

Remove it from the repository and history as appropriate, but treat it as compromised first: revoke or rotate the credential at the provider. Deleting it from the latest file alone does not make an exposed secret safe.
