"use client";

import { createClientLogger } from "@/lib/client-logger";
import { generatedSeoContentSchema } from "@/lib/seo-schemas";
import type { GeneratedSeoContent } from "@/types";
import {
  ChevronDown,
  Globe,
  Loader2,
  Palette,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const fieldShell =
  "rounded-2xl border border-zinc-200/90 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:rounded-3xl md:p-6";
const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-zinc-950 shadow-inner transition-[box-shadow,border-color,background-color] placeholder:text-zinc-400 focus:border-sky-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 md:py-3.5";
const selectClass = `${inputClass} appearance-none pr-10`;
const labelClass =
  "mb-2 flex items-center gap-2 text-sm font-medium tracking-tight text-zinc-800";

const log = createClientLogger("KeywordForm");

export default function KeywordForm({
  setGeneratedContent,
}: {
  setGeneratedContent: (content: GeneratedSeoContent) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState("");
  const [audience, setAudience] = useState("");
  const [language, setLanguage] = useState("us-english");
  const [isGenerating, setIsGenerating] = useState(false);

  const validateForm = (): boolean => {
    if (!keyword.trim()) {
      toast.error("Target keyword is required", {
        description: "Please enter a target keyword",
        position: "top-right",
      });
      return false;
    }
    if (!tone) {
      toast.error("Writing tone is required", {
        description: "Please select a writing tone",
        position: "top-right",
      });
      return false;
    }
    if (!audience) {
      toast.error("Target audience is required", {
        description: "Please select a target audience",
        position: "top-right",
      });
      return false;
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, tone, audience, language }),
      });

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        toast.error("Invalid response", {
          description: "The server did not return JSON.",
          position: "top-right",
        });
        return;
      }

      if (!response.ok) {
        const msg =
          typeof (data as { error?: string }).error === "string"
            ? (data as { error: string }).error
            : response.statusText || "Request failed";
        toast.error("Could not generate content", {
          description: msg,
          position: "top-right",
        });
        return;
      }

      const rawContent = (data as { content?: unknown }).content;
      const validated = generatedSeoContentSchema.safeParse(rawContent);
      if (!validated.success) {
        toast.error("Unexpected response shape", {
          description: "The model returned data we could not display.",
          position: "top-right",
        });
        return;
      }

      setGeneratedContent(validated.data);
    } catch (error) {
      log.errorWithCause("Generate request failed", error);
      toast.error("Failed to generate content", {
        description: "Please try again",
        position: "top-right",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-12 md:gap-5">
      <div className={`${fieldShell} md:col-span-12`}>
        <label htmlFor="keyword" className={labelClass}>
          <Search className="size-4 shrink-0 text-sky-600" aria-hidden />
          Target keyword
        </label>
        <input
          id="keyword"
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="e.g. content marketing, AI tools, productivity"
          className={`${inputClass} text-base md:text-lg md:leading-snug`}
        />
      </div>

      <div className={`${fieldShell} md:col-span-6`}>
        <label htmlFor="tone" className={labelClass}>
          <Palette className="size-4 shrink-0 text-sky-600" aria-hidden />
          Tone
        </label>
        <div className="relative">
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className={selectClass}
          >
            <option value="">Select a tone…</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="authoritative">Authoritative</option>
            <option value="conversational">Conversational</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
        </div>
      </div>

      <div className={`${fieldShell} md:col-span-6`}>
        <label htmlFor="audience" className={labelClass}>
          <Users className="size-4 shrink-0 text-sky-600" aria-hidden />
          Target audience
        </label>
        <div className="relative">
          <select
            id="audience"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className={selectClass}
          >
            <option value="">Select an audience…</option>
            <option value="small-business-owners">Small Business Owners</option>
            <option value="entrepreneurs">Entrepreneurs</option>
            <option value="marketers">Marketers</option>
            <option value="developers">Developers</option>
            <option value="executives">Executives</option>
            <option value="students">Students</option>
            <option value="general-consumers">General Consumers</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
        </div>
      </div>

      <div className={`${fieldShell} md:col-span-5`}>
        <label htmlFor="language" className={labelClass}>
          <Globe className="size-4 shrink-0 text-sky-600" aria-hidden />
          Language / region
        </label>
        <div className="relative">
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={selectClass}
          >
            <option value="">Select a language…</option>
            <option value="us-english">US English</option>
            <option value="uk-english">UK English</option>
            <option value="ukrainian">Ukrainian</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="italian">Italian</option>
            <option value="portuguese">Portuguese</option>
            <option value="russian">Russian</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3.5 top-1/2 size-[1.125rem] -translate-y-1/2 text-zinc-400"
            aria-hidden
          />
        </div>
      </div>

      <div
        className={`${fieldShell} flex min-h-[140px] flex-col justify-center border-sky-200/80 bg-gradient-to-br from-sky-50/90 to-white md:col-span-7 md:min-h-0`}
      >
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          aria-busy={isGenerating}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-600 px-6 py-4 text-base font-medium text-white shadow-md shadow-sky-600/20 transition-[transform,box-shadow,background-color] hover:bg-sky-700 hover:shadow-lg hover:shadow-sky-600/25 active:scale-[0.99] disabled:cursor-wait disabled:opacity-90 disabled:hover:scale-100 md:min-h-[72px] md:text-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden />
              Generating…
            </>
          ) : (
            <>
              <Sparkles
                className="size-5 shrink-0 transition-transform group-hover:rotate-12"
                aria-hidden
              />
              Generate ideas
            </>
          )}
        </button>
        <p className="mt-3 text-center text-xs text-zinc-500 md:text-left">
          Typical run: a few seconds. Results appear below.
        </p>
      </div>
    </div>
  );
}
