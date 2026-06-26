import { createClient } from "@sanity/client";

const projectId =
  process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ??
  process.env.NEXT_PUBLIC_SANITY_DATASET ??
  "production";

export const isSanityConfigured = Boolean(projectId && dataset);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2026-06-26",
      useCdn: process.env.NODE_ENV === "production",
      perspective: "published",
    })
  : null;

export async function sanityFetch<T>(
  query: string,
  params: Record<string, string | number | boolean> = {},
) {
  if (!sanityClient) return undefined;

  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[sanity] Falling back to local content.", error);
    }
    return undefined;
  }
}
