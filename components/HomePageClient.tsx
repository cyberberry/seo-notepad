"use client";

import KeywordForm from "@/components/KeywordForm";
import ResultsPanel from "@/components/ResultsPanel";
import type { GeneratedSeoContent, ActiveTab } from "@/types";
import { FileText, Sparkles } from "lucide-react";
import { Lexend } from "next/font/google";
import { motion } from "framer-motion";
import { useState } from "react";

const display = Lexend({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HomePageClient() {
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedSeoContent | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("titles");

  return (
    <>
      <motion.div
        className="mb-6 grid auto-rows-min gap-4 md:mb-8 md:grid-cols-12 md:gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.header
          variants={itemVariants}
          className="flex flex-col justify-between rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm md:col-span-8 md:min-h-[200px] md:rounded-3xl md:p-8"
        >
          <p className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium tracking-wide text-sky-800 uppercase">
            <Sparkles className="size-3.5 shrink-0" aria-hidden />
            AI-powered
          </p>
          <div>
            <h1
              className={`${display.className} text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl md:text-5xl md:leading-[1.1]`}
            >
              The SEO Notepad
            </h1>
            <p className="mt-3 max-w-xl text-pretty text-base text-zinc-600 md:text-lg">
              Generate titles, meta descriptions, and outlines in one pass—tuned
              for search and your readers.
            </p>
          </div>
        </motion.header>

        <motion.aside
          variants={itemVariants}
          className="flex flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-md md:col-span-4 md:min-h-[200px] md:rounded-3xl md:p-7"
        >
          <div className="flex size-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-lg shadow-sky-500/25">
            <FileText className="size-6" aria-hidden />
          </div>
          <p className="text-sm leading-relaxed text-zinc-400">
            Drop in a keyword, pick tone and audience—get structured ideas you can
            ship today.
          </p>
        </motion.aside>
      </motion.div>

      <motion.div
        className="mb-8 md:mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      >
        <KeywordForm setGeneratedContent={setGeneratedContent} />
      </motion.div>

      {generatedContent && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <ResultsPanel
            content={generatedContent}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </motion.div>
      )}
    </>
  );
}
