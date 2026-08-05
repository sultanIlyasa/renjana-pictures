# Cloudflare Deployment

The production site runs as one Cloudflare Worker through OpenNext. Homepage
and article content are currently local; Sanity remains installed but is not
queried by the live homepage. The hero defaults to the public R2 object at
`https://media.sarikayalabs.com/renjana-showreel-flaten.mp4`.

## Stream

1. In Cloudflare, open **Stream > Videos > Upload**.
2. Upload the optimized hero video and wait for the status to become **Ready**.
3. Open the video, then copy **Settings > HLS Manifest URL**.
4. Add this Cloudflare Workers build variable:

   ```text
   NEXT_PUBLIC_CLOUDFLARE_STREAM_HLS_URL=https://customer-<CODE>.cloudflarestream.com/<UID>/manifest/video.m3u8
   ```

The variable must exist before the build because Next.js inlines
`NEXT_PUBLIC_*` values into the browser bundle. The hero autoplays muted and
loops; the visitor can enable sound with the video sound control.

To replace the checked-in R2 URL later, leave the Stream variable empty and set
a public MP4 URL instead:

```text
NEXT_PUBLIC_HERO_VIDEO_URL=https://media.example.com/renjana-showreel.mp4
```

R2 does not transcode or generate adaptive HLS renditions. The browser receives
the uploaded MP4 directly.

## Workers Builds

Use the repository root directory `renjana` when the connected Git repository
opens at `project-sarikaya`.

- Build command: `npm run build:cloudflare`
- Deploy command: `npx wrangler deploy`
- Production branch: `main`

`wrangler.jsonc` points Wrangler at the OpenNext worker and generated static
assets. Test the same output locally with `npm run preview`.
