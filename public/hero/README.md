# Hero Video Asset

The production showreel is hosted by Cloudflare Stream and loaded from its HLS
manifest. Do not place a hero master in this directory: files in `public` become
Worker static assets and Cloudflare limits each static asset to 25 MiB.

Set the public HLS manifest at build time:

```text
NEXT_PUBLIC_CLOUDFLARE_STREAM_HLS_URL=https://customer-<CODE>.cloudflarestream.com/<UID>/manifest/video.m3u8
```

`public/work/sunset.mp4` remains the small development and playback-error
fallback. Keep original masters in private archival storage.
