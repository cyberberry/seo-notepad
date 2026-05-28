import "server-only";
import OpenAI from "openai";
import type { BuildUserPromptInput, GeneratedSeoContent } from "@/types";
import { createLogger } from "@/lib/logger";
import { parseGeneratedSeoContentJson } from "@/lib/seo-schemas";
import { buildSystemPrompt, buildUserPrompt } from "./prompts";

const log = createLogger("openai");

export async function generateSeoContent(
  input: BuildUserPromptInput,
): Promise<GeneratedSeoContent | null> {
  const startedAt = Date.now();
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.OPENAI_MODEL?.trim();

  if (!apiKey) {
    log.error("Missing OPENAI_API_KEY");
    return null;
  }
  if (!model) {
    log.error("Missing OPENAI_MODEL");
    return null;
  }

  log.debug("Starting generation", {
    model,
    keywordLength: input.keyword.length,
    tone: input.tone,
    audience: input.audience,
    language: input.language,
    titleCount: input.titleCount,
    metaCount: input.metaCount,
    sectionCount: input.sectionCount,
  });

  const openai = new OpenAI({ apiKey });

  try {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(input);
    const response = await openai.chat.completions.create({
      model,
      max_completion_tokens: 32768,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = response.choices[0]?.message?.content;
    if (raw == null || !String(raw).trim()) {
      log.error("Empty model content", {
        finishReason: response.choices[0]?.finish_reason,
        durationMs: Date.now() - startedAt,
      });
      return null;
    }

    const parsed = parseGeneratedSeoContentJson(String(raw));
    if (!parsed.success) {
      const zodIssues =
        "issues" in parsed.error
          ? parsed.error.issues.map((i) => ({
              path: i.path,
              message: i.message,
            }))
          : undefined;
      log.error("Invalid model JSON", {
        durationMs: Date.now() - startedAt,
        ...(zodIssues ? { zodIssues } : { parseError: String(parsed.error) }),
      });
      return null;
    }

    log.info("Generation succeeded", {
      model,
      durationMs: Date.now() - startedAt,
      titleCount: parsed.data.titles.length,
      metaCount: parsed.data.metaDescriptions.length,
      sectionCount: parsed.data.outlineSections.length,
      promptTokens: response.usage?.prompt_tokens,
      completionTokens: response.usage?.completion_tokens,
      totalTokens: response.usage?.total_tokens,
    });

    return parsed.data;
  } catch (error) {
    log.errorWithCause("OpenAI request failed", error, {
      model,
      durationMs: Date.now() - startedAt,
    });
    return null;
  }
}
