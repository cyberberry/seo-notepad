import { z } from "zod";

/** POST /api/generate body — clamps sizes to limit abuse and cost. */
export const generateRequestSchema = z
  .object({
    keyword: z.string().trim().min(1).max(500),
    tone: z.string().max(120).optional(),
    audience: z.string().max(120).optional(),
    language: z.string().max(80).optional(),
    titleCount: z.number().int().min(1).max(15).optional(),
    metaCount: z.number().int().min(1).max(15).optional(),
    sectionCount: z.number().int().min(1).max(20).optional(),
  })
  .strict();

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;

const outlineSectionSchema = z.object({
  heading: z.string(),
  bullets: z.array(z.string()),
});

/** Parsed model output — matches `GeneratedSeoContent`. */
export const generatedSeoContentSchema = z.object({
  titles: z.array(z.string()),
  metaDescriptions: z.array(z.string()),
  outlineSections: z.array(outlineSectionSchema),
});

export type ParsedGeneratedSeoContent = z.infer<typeof generatedSeoContentSchema>;

/** Strip optional ```json fences from model text before JSON.parse. */
export function stripJsonMarkdownFences(text: string): string {
  const t = text.trim();
  if (!t.startsWith("```")) {
    return t;
  }
  return t
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/u, "")
    .trim();
}

export function parseGeneratedSeoContentJson(raw: string): {
  success: true;
  data: ParsedGeneratedSeoContent;
} | { success: false; error: z.ZodError | Error } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stripJsonMarkdownFences(raw));
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e : new Error("Invalid JSON"),
    };
  }
  const result = generatedSeoContentSchema.safeParse(parsed);
  if (!result.success) {
    return { success: false, error: result.error };
  }
  return { success: true, data: result.data };
}
