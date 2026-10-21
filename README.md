# Hoppy Home Edit

Website for Hoppy Home Edit, Emma's home organizing, selling and thrifting business in the Greater Phoenix area. Organize · Sell · Thrift.

## What's here

- `index.html`: the landing page (plain HTML, no build step)
- `site.css`: form styles, focus rings and other extras the design canvas doesn't carry
- `consult.js`: sends the "free consult" form to Supabase. Until Supabase is set up, it opens the visitor's email app instead (once `contactEmail` is filled in)
- `config.js`: Supabase project URL and anon key, Emma's email, and her Instagram link
- `supabase/consult_requests.sql`: creates the `consult_requests` table (visitors can submit requests but can't read them)
- `assets/`: logo, frog, favicon and the link-preview image
- `vercel.json`: Vercel settings (clean URLs, basic security headers, image caching)
- `scripts/export-design.py` and `partials/`: rebuild `index.html` from the Claude Design file

## Deploying on Vercel

1. In Vercel, choose **Add New → Project** and import this GitHub repo.
2. Framework preset: **Other**. Leave the build command and output directory empty.
3. Deploy. Every push to `main` redeploys automatically.

## Supabase (consult form)

1. Create a Supabase project.
2. In **SQL Editor**, run `supabase/consult_requests.sql`.
3. From **Project Settings → API**, copy the project URL and the `anon` public key into `config.js`, then push.
4. New requests show up in **Table Editor → consult_requests**. Use the `status` column (new, contacted, booked, closed) to keep track.

## Still to fill in

Prices, before-and-after photos, Emma's photo, the thrift finds, client quotes, her email and Instagram. Look for `[BRACKETED]` text in `index.html`, and the empty values in `config.js`.

## Editing the design

The design lives in Claude Design ("Hoppy Home Edit Website", artboard "Home page"). To bring changes over, download `Main.dc.html` from the canvas and run:

```
python3 scripts/export-design.py path/to/Main.dc.html
```
