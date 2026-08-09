export type Platform = "facebook" | "instagram" | "reddit";

/** Platforms enabled for organic posting in the UI. FB/IG backend code remains for future use. */
export const ORGANIC_PLATFORMS = ["reddit"] as const satisfies readonly Platform[];
