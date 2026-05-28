import { BuildUserPromptInput } from "@/types";

export const buildSystemPrompt = () => `
Generate high-quality SEO titles, SEO meta descriptions, and article outline sections based on provided keyword(s), tone, target audience, and language. The output must be optimized for search engines, aligns with the specified tone and audience, and is relevant to the input keywords before constructing any titles, descriptions, or outlines.

**Guidelines:**
- Each SEO title should be engaging, concise (up to 60 characters), incorporate the main keyword(s), and appeal to the target audience.
- Each SEO meta description should be up to 160 characters, highlight key benefits or unique selling points, encourage clicks, and include the keyword(s).
- Each outline section should be a brief heading (suitable for an H2) capturing an essential part of the content, based on the keyword(s), tone, and audience.
- Use appropriate language as specified in the input.
`.trim();

export const buildUserPrompt = (input: BuildUserPromptInput) => {
    const {
        keyword,
        tone,
        audience,
        language = "English (US)",
        titleCount = 5,
        metaCount = 5,
        sectionCount = 5,
    } = input;


    return `
Generate SEO content for this topic:
Keyword: "${keyword}"
Audience: "${audience || "General audience"}"
Tone: "${tone || "Professional and clear"}"
Language: "${language}"

Requirements:
- Provide exactly ${titleCount} items in "titles".
- Provide exactly ${metaCount} items in "metaDescriptions" (~150-160 chars each when possible).
- Provide exactly ${sectionCount} items in "outlineSections".
- Each outline section object must include:
  - "heading": concise H2-style heading
  - "bullets": 2-3 actionable points (array of strings)
- Keep output practical, specific, and non-repetitive.

JSON shape (use these exact key names, no other top-level keys):
{"titles":["..."],"metaDescriptions":["..."],"outlineSections":[{"heading":"...","bullets":["...","..."]}]}

Return JSON only (no markdown fences, no commentary).
`.trim();
};