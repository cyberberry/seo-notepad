import { generateSeoContent } from "@/lib/openai";
import { createLogger } from "@/lib/logger";
import { generateRequestSchema } from "@/lib/seo-schemas";
import type { BuildUserPromptInput } from "@/types";
import { NextResponse } from "next/server";

const log = createLogger("api.generate");

export async function POST(req: Request) {
  const startedAt = Date.now();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    log.warn("Invalid JSON body", { durationMs: Date.now() - startedAt });
    return NextResponse.json(
      { error: "Invalid or empty JSON body" },
      { status: 400 },
    );
  }

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    log.warn("Request validation failed", {
      durationMs: Date.now() - startedAt,
      issueCount: parsed.error.issues.length,
      issues: parsed.error.issues.map((i) => ({
        path: i.path,
        message: i.message,
      })),
    });
    return NextResponse.json(
      {
        error: "Invalid request",
        issues: parsed.error.issues.map((i) => ({
          path: i.path,
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }

  const d = parsed.data;
  const input: BuildUserPromptInput = {
    keyword: d.keyword,
    tone: d.tone,
    audience: d.audience,
    language: d.language ?? "English (US)",
    titleCount: d.titleCount ?? 5,
    metaCount: d.metaCount ?? 5,
    sectionCount: d.sectionCount ?? 5,
  };

  log.info("Generation request accepted", {
    keywordLength: d.keyword.length,
    tone: d.tone,
    audience: d.audience,
    language: input.language,
    titleCount: input.titleCount,
    metaCount: input.metaCount,
    sectionCount: input.sectionCount,
  });

  const content = await generateSeoContent(input);
  if (!content) {
    log.error("Generation failed", { durationMs: Date.now() - startedAt });
    return NextResponse.json(
      { error: "Failed to generate SEO content" },
      { status: 500 },
    );
  }

  log.info("Generation request completed", {
    durationMs: Date.now() - startedAt,
    titleCount: content.titles.length,
    metaCount: content.metaDescriptions.length,
    sectionCount: content.outlineSections.length,
  });

  return NextResponse.json({ content }, { status: 200 });
}
