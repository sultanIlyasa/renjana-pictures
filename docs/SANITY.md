# Sanity integration

This app can read Sanity content when these environment variables are set:

```bash
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
```

If they are missing, the site uses the local placeholder content.

## Create the Sanity project

```bash
npm create sanity@latest -- --dataset production --template clean --typescript --output-path renjana-studio
```

Sanity's Next.js quickstart uses `npm create sanity@latest` to create a Studio, then `npm run dev` inside the Studio folder.

## Documents used by this site

Create these document types in your Studio schema:

### `siteSettings`

Use this as a singleton document. The app reads:

- `hero.id`, `hero.en`
- `lightRing.id`, `lightRing.en`
- `story.id`, `story.en`
- `contactDetails`

Each localized object should match the names already used in the code, for example:

```ts
{
  hero: {
    id: {
      credit: "Siaran - Film - Iklan",
      headline: [{text: "Gambar"}, {text: "bertahan.", accent: true}],
      video: {
        src: "https://...",
        poster: "https://..."
      }
    },
    en: {
      credit: "Broadcast - Film - Advertising"
    }
  },
  contactDetails: {
    phoneDisplay: "0878-8210-0888",
    phoneHref: "tel:+6287882100888",
    email: "masayurenjana@gmail.com",
    emailHref: "mailto:masayurenjana@gmail.com",
    mapsUrl: "https://maps.app.goo.gl/ruMos1gTXsFq9Wx67"
  }
}
```

### `article`

Fields:

- `language`: `id` or `en`
- `slug`: slug
- `title`: string
- `date`: string
- `body`: text
- `deck`: text
- `paragraphs`: array of strings
- `caption`: string
- `cta`: string
- `alt`: string
- `image`: image
- `imageUrl`: optional string fallback
- `orderRank`: number

The homepage article carousel and `/articles/[slug]` pages read this document type.
