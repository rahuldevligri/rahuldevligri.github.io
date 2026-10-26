#!/usr/bin/env python3
"""Dependency-free checks for Rahul Devligri's GitHub Pages portfolio."""
from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = "https://rahuldevligri.github.io/"
REQUIRED_PAGES = [
    Path("index.html"),
    Path("projects/saml-2-sso.html"),
    Path("projects/smartreactor-ai.html"),
    Path("projects/travel-policy-engine.html"),
]


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title_parts: list[str] = []
        self.h1_parts: list[str] = []
        self._in_title = False
        self._h1_depth = 0
        self.meta: list[dict[str, str]] = []
        self.canonicals: list[str] = []
        self.ids: list[str] = []
        self.images: list[dict[str, str | None]] = []
        self.links: list[str] = []
        self.jsonld: list[str] = []
        self._in_jsonld = False
        self._jsonld_parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        a = {k.lower(): (v or "") for k, v in attrs}
        if "id" in a and a["id"]:
            self.ids.append(a["id"])
        if tag == "title":
            self._in_title = True
        if tag == "h1":
            self._h1_depth += 1
        if tag == "meta":
            self.meta.append({k.lower(): v for k, v in a.items()})
        if tag == "link" and "canonical" in a.get("rel", "").lower().split():
            self.canonicals.append(a.get("href", ""))
        if tag == "img":
            self.images.append({"alt": a.get("alt") if "alt" in a else None, "src": a.get("src")})
        if tag in {"a", "link", "script", "img", "source", "video", "audio"}:
            key = "src" if tag in {"script", "img", "source", "video", "audio"} else "href"
            if a.get(key):
                self.links.append(a[key])
        if tag == "script" and a.get("type", "").lower() == "application/ld+json":
            self._in_jsonld = True
            self._jsonld_parts = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._in_title = False
        if tag == "h1" and self._h1_depth:
            self._h1_depth -= 1
        if tag == "script" and self._in_jsonld:
            self.jsonld.append("".join(self._jsonld_parts).strip())
            self._in_jsonld = False
            self._jsonld_parts = []

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self.title_parts.append(data)
        if self._h1_depth:
            self.h1_parts.append(data)
        if self._in_jsonld:
            self._jsonld_parts.append(data)


def local_target(page: Path, raw_url: str) -> tuple[Path | None, str, bool]:
    """Return local target path, fragment, and whether URL belongs to this site."""
    url = raw_url.strip()
    if not url:
        return None, "", False
    if url.startswith("#"):
        fragment = unquote(url[1:])
        return (ROOT / page if fragment else None), fragment, bool(fragment)
    if url.startswith(("mailto:", "tel:", "javascript:", "data:", "blob:")):
        return None, "", False
    joined = urljoin(BASE_URL + page.as_posix(), url)
    parsed = urlparse(joined)
    if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() != "rahuldevligri.github.io":
        return None, "", False
    rel = unquote(parsed.path).lstrip("/")
    target = ROOT / rel if rel else ROOT / "index.html"
    if target.is_dir():
        target = target / "index.html"
    return target, unquote(parsed.fragment), True


def main() -> int:
    errors: list[str] = []
    checked = 0
    page_parsers: dict[Path, PageParser] = {}

    for page in REQUIRED_PAGES:
        full = ROOT / page
        if not full.is_file():
            errors.append(f"Missing required page: {page.as_posix()}")
            continue
        parser = PageParser()
        try:
            parser.feed(full.read_text(encoding="utf-8"))
        except Exception as exc:  # report decoding/parser errors as a validation error
            errors.append(f"Could not parse {page.as_posix()}: {exc}")
            continue
        page_parsers[page] = parser
        checked += 1

        if not "".join(parser.title_parts).strip():
            errors.append(f"{page}: missing <title>")
        if not "".join(parser.h1_parts).strip():
            errors.append(f"{page}: missing an <h1>")
        descriptions = [m.get("content", "").strip() for m in parser.meta if m.get("name", "").lower() == "description"]
        if not any(descriptions):
            errors.append(f"{page}: missing meta description")
        if len(parser.canonicals) != 1 or not parser.canonicals[0].startswith(BASE_URL):
            errors.append(f"{page}: expected exactly one canonical URL under {BASE_URL}")

        counts = Counter(parser.ids)
        duplicates = sorted(i for i, n in counts.items() if n > 1)
        if duplicates:
            errors.append(f"{page}: duplicate id(s): {', '.join(duplicates)}")

        for image in parser.images:
            if image["alt"] is None:
                errors.append(f"{page}: image missing alt attribute (src={image['src']})")

        for index, raw in enumerate(parser.jsonld, 1):
            try:
                json.loads(raw)
            except json.JSONDecodeError as exc:
                errors.append(f"{page}: JSON-LD block {index} is invalid JSON ({exc.msg})")
        if not parser.jsonld:
            errors.append(f"{page}: missing JSON-LD structured data")

    # Check local page, script, stylesheet, image and document references.
    for page, parser in page_parsers.items():
        for raw in parser.links:
            target, fragment, is_local = local_target(page, raw)
            if not is_local or target is None:
                continue
            if not target.is_file():
                errors.append(f"{page}: broken local reference '{raw}' (expected {target.relative_to(ROOT) if target.is_relative_to(ROOT) else target})")
                continue
            if fragment:
                target_rel = target.relative_to(ROOT)
                target_parser = page_parsers.get(target_rel)
                if target_parser is None and target.suffix.lower() == ".html":
                    target_parser = PageParser()
                    try:
                        target_parser.feed(target.read_text(encoding="utf-8"))
                    except Exception:
                        target_parser = None
                if target_parser is not None and fragment not in target_parser.ids:
                    errors.append(f"{page}: broken fragment '{raw}' (id '{fragment}' not found in {target_rel.as_posix()})")

    sitemap = ROOT / "sitemap.xml"
    if not sitemap.is_file():
        errors.append("Missing sitemap.xml")
    else:
        try:
            tree = ET.parse(sitemap)
            ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
            urls = [node.text.strip() for node in tree.findall(".//sm:loc", ns) if node.text and node.text.strip()]
            if not urls:
                errors.append("sitemap.xml: no <loc> URLs found")
            for raw in urls:
                target, _, is_local = local_target(Path("index.html"), raw)
                if not is_local or target is None or not target.is_file():
                    errors.append(f"sitemap.xml: URL is outside the site or target does not exist: {raw}")
        except ET.ParseError as exc:
            errors.append(f"sitemap.xml: invalid XML ({exc})")

    robots = ROOT / "robots.txt"
    if not robots.is_file():
        errors.append("Missing robots.txt")
    else:
        contents = robots.read_text(encoding="utf-8", errors="replace").lower()
        if "sitemap.xml" not in contents:
            errors.append("robots.txt: add a Sitemap: https://rahuldevligri.github.io/sitemap.xml entry")

    if errors:
        print("Portfolio validation FAILED")
        for error in errors:
            print(f" - {error}")
        return 1

    print(f"Portfolio validation PASSED: {checked} HTML pages, local references, JSON-LD, sitemap and robots.txt checked.")
    print("JavaScript syntax is checked separately by the GitHub Actions workflow.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
