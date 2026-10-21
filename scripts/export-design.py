"""Turn the Claude Design artboard (Main.dc.html) into the static index.html.

Usage: python3 scripts/export-design.py path/to/Main.dc.html

It moves the <helmet> contents into <head>, fills the design's tweak values
with the "playful" defaults, points uploaded images at assets/, and swaps the
placeholder email button for the consult request form.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
src = Path(sys.argv[1]).read_text()

helmet = re.search(r"<helmet>(.*?)</helmet>", src, re.S).group(1).strip()
body = re.search(r"<x-dc>(.*?)</x-dc>", src, re.S).group(1)
body = re.sub(r"<helmet>.*?</helmet>", "", body, flags=re.S).strip()

values = {
    "accent": "#F38FB2",
    "tiltA": "rotate(2.5deg)",
    "tiltB": "rotate(-2deg)",
    "tiltSmall": "rotate(-3deg)",
}
for k, v in values.items():
    body = body.replace("{{" + k + "}}", v)
left = re.findall(r"\{\{[^}]*\}\}", body)
if left:
    sys.exit(f"Unfilled design values: {sorted(set(left))}")

images = {
    "/_blob/4a74d9f3e925e6141c2c9891c1bd1adc": "/assets/logo.webp",
    "/_blob/d2e0de9833c1e1792b91ddc8172346c3": "/assets/logo-small.webp",
    "/_blob/ad63a6635ac441b4781ee99df0ee2ea6": "/assets/frog.webp",
}
for k, v in images.items():
    body = body.replace(k, v)
if "/_blob/" in body:
    sys.exit("An image in the design has no matching file in assets/ yet.")

# The booking section: replace the [EMAIL ADDRESS] button with the form.
form = (ROOT / "partials" / "consult-form.html").read_text().strip()
email_btn = re.search(r'<a href="#"[^>]*>\[EMAIL ADDRESS\]</a>\n?', body)
if email_btn:
    body = body.replace(email_btn.group(0), "")
marker = '<p style="margin: 0; font-size: 0.95rem; color: #6E5F55">Serving'
if marker not in body:
    sys.exit("Couldn't find the service-area line in the booking section.")
body = body.replace(marker, form + "\n" + marker, 1)
body = body.replace(
    '<a href="#" style="display: inline-flex; align-items: center; min-height: 56px; padding: 0 30px; border-radius: 999px; border: 3px solid #1F1719; color: #1F1719; text-decoration: none; font-weight: 700">follow along on instagram</a>',
    '<a href="#" data-instagram style="display: inline-flex; align-items: center; min-height: 56px; padding: 0 30px; border-radius: 999px; border: 3px solid #1F1719; color: #1F1719; text-decoration: none; font-weight: 700">follow along on instagram</a>',
)

head = (ROOT / "partials" / "head.html").read_text().strip()
page = f"""<!doctype html>
<html lang="en">
<head>
{head}
{helmet}
<link rel="stylesheet" href="/site.css">
</head>
<body>
{body}
<script src="/config.js"></script>
<script src="/consult.js"></script>
</body>
</html>
"""
(ROOT / "index.html").write_text(page)
print(f"Wrote index.html ({len(page):,} bytes)")
