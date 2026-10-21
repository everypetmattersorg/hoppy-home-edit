# Hoppy Home Edit

Website for Hoppy Home Edit, Emma's home organizing, selling and thrifting business in the Greater Phoenix area. Organize · Sell · Thrift.

## What's here

- `index.html`: the landing page (plain HTML, no build step)
- `site.css`: form styles, focus rings and other extras the design canvas doesn't carry
- `consult.js`: sends the "free consult" form to Supabase. Until Supabase is set up, it opens the visitor's email app instead (once `contactEmail` is filled in)
- `config.js`: Supabase project URL and anon key, Emma's email, and her Instagram link
- `supabase/hoppy_consult_requests.sql`: the `hoppy_consult_requests` table (visitors can submit requests but can't read them)
- `assets/`: logo, frog, favicon and the link-preview image
- `vercel.json`: Vercel settings (clean URLs, basic security headers, image caching)
- `scripts/export-design.py` and `partials/`: rebuild `index.html` from the Claude Design file

## Deploying on Vercel

1. In Vercel, choose **Add New → Project** and import this GitHub repo.
2. Framework preset: **Other**. Leave the build command and output directory empty.
3. Deploy. Every push to `main` redeploys automatically.

## Supabase (consult form)

Requests are stored in the **confluence-creative-co** Supabase project, in the `hoppy_consult_requests` table. It's already set up and `config.js` already has the project URL and public key.

- See new requests in **Table Editor → hoppy_consult_requests**. Use the `status` column (new, contacted, booked, closed) to keep track.
- Visitors can only add requests. Nobody can read them without logging in to Supabase.
- To move Emma to her own Supabase project later: run `supabase/hoppy_consult_requests.sql` there, then swap the URL and key in `config.js`.

## Still to fill in

Prices, before-and-after photos, Emma's photo, the thrift finds, client quotes, her reply time, email and Instagram. Look for `[BRACKETED]` text in `index.html`, and the empty `contactEmail` and `instagramUrl` in `config.js`.

## Editing the design

The design lives in Claude Design ("Hoppy Home Edit Website", artboard "Home page"). To bring changes over, download `Main.dc.html` from the canvas and run:

```
python3 scripts/export-design.py path/to/Main.dc.html
```
