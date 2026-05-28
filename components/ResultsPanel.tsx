"use client";

import type { ActiveTab, OutlineSection, ResultsPanelProps } from "@/types";
import { AlignLeft, Copy, FileText, List } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

const tabs: { id: ActiveTab; label: string; icon: typeof FileText }[] = [
  { id: "titles", label: "Titles", icon: FileText },
  { id: "meta", label: "Meta descriptions", icon: AlignLeft },
  { id: "outline", label: "Outline", icon: List },
];

const listItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const panelVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.06,
      delayChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const copyRowClass =
  "group relative flex w-full cursor-pointer items-start gap-3 rounded-2xl border border-zinc-200/90 bg-zinc-50/40 p-4 text-left transition-[border-color,box-shadow] hover:border-sky-300/70 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 md:p-5";

async function copyToClipboard(text: string, successTitle: string) {
  const t = text.trim();
  if (!t) {
    return;
  }
  try {
    await navigator.clipboard.writeText(t);
    toast.success(successTitle, {
      description: "Copied to clipboard",
      position: "top-right",
    });
  } catch {
    toast.error("Could not copy", {
      description: "Clipboard access was blocked or unavailable.",
      position: "top-right",
    });
  }
}

function formatOutlineSection(section: OutlineSection): string {
  const bullets = section.bullets ?? [];
  const lines = [section.heading, ...bullets.map((b) => `• ${b}`)];
  return lines.join("\n");
}

export default function ResultsPanel({
  content,
  activeTab,
  setActiveTab,
}: ResultsPanelProps) {
  const titles = content.titles ?? [];
  const metaDescriptions = content.metaDescriptions ?? [];
  const outlineSections = content.outlineSections ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm md:rounded-3xl">
      <div className="border-b border-zinc-200/90 bg-zinc-50/80 p-2 md:p-2.5">
        <div className="relative flex gap-1 rounded-xl bg-zinc-100/90 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors md:py-3 ${
                  isActive
                    ? "text-zinc-950"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="results-tab-pill"
                    className="absolute inset-0 z-0 rounded-lg bg-white shadow-sm ring-1 ring-zinc-200/80"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative z-10 flex min-w-0 items-center justify-center gap-2">
                  <Icon className="size-4 shrink-0" aria-hidden />
                  {tab.id === "meta" ? (
                    <>
                      <span className="truncate sm:hidden">Meta</span>
                      <span className="hidden truncate sm:inline">
                        Meta descriptions
                      </span>
                    </>
                  ) : (
                    <span className="truncate">{tab.label}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-5 md:p-8">
        <AnimatePresence mode="wait">
          {activeTab === "titles" && (
            <motion.div
              key="titles"
              role="tabpanel"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-3 md:space-y-4"
            >
              {titles.map((title, index) => (
                <motion.button
                  key={`title-${index}`}
                  type="button"
                  variants={listItem}
                  title="Click to copy"
                  aria-label={`Copy title ${index + 1}`}
                  onClick={() => void copyToClipboard(title, "Title copied")}
                  className={copyRowClass}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-sm font-semibold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <span className="block min-w-0 flex-1 pt-1 text-left text-[15px] leading-relaxed text-zinc-800 md:text-base">
                    {title}
                  </span>
                  <Copy
                    className="mt-1 size-4 shrink-0 text-zinc-400 opacity-80 transition-opacity group-hover:text-sky-600 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
                    aria-hidden
                  />
                </motion.button>
              ))}
            </motion.div>
          )}

          {activeTab === "meta" && (
            <motion.div
              key="meta"
              role="tabpanel"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-3 md:space-y-4"
            >
              {metaDescriptions.map((description, index) => (
                <motion.button
                  key={`meta-${index}`}
                  type="button"
                  variants={listItem}
                  title="Click to copy"
                  aria-label={`Copy meta description ${index + 1}`}
                  onClick={() =>
                    void copyToClipboard(description, "Meta description copied")
                  }
                  className={copyRowClass}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-sm font-semibold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <span className="block min-w-0 flex-1 pt-1 text-left text-[15px] leading-relaxed text-zinc-600 md:text-base">
                    {description}
                  </span>
                  <Copy
                    className="mt-1 size-4 shrink-0 text-zinc-400 opacity-80 transition-opacity group-hover:text-sky-600 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
                    aria-hidden
                  />
                </motion.button>
              ))}
            </motion.div>
          )}

          {activeTab === "outline" && (
            <motion.div
              key="outline"
              role="tabpanel"
              variants={panelVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-5 md:space-y-6"
            >
              {outlineSections.map((section, index) => (
                <motion.div
                  key={`outline-${index}`}
                  role="button"
                  tabIndex={0}
                  variants={listItem}
                  title="Click to copy full section"
                  aria-label={`Copy outline section ${index + 1}: ${section.heading}`}
                  className={copyRowClass}
                  onClick={() =>
                    void copyToClipboard(
                      formatOutlineSection(section),
                      "Section copied",
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      void copyToClipboard(
                        formatOutlineSection(section),
                        "Section copied",
                      );
                    }
                  }}
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-sm font-semibold text-white shadow-sm">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-base font-semibold tracking-tight text-sky-800 md:text-lg">
                      {section.heading}
                    </p>
                    <ul className="mt-2 list-none space-y-2 sm:ml-0">
                      {(section.bullets ?? []).map((bullet, subIndex) => (
                        <li
                          key={subIndex}
                          className="flex items-start gap-2 text-[15px] leading-relaxed text-zinc-600 md:text-base"
                        >
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-sky-500" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Copy
                    className="mt-1 size-4 shrink-0 self-start text-zinc-400 opacity-80 transition-opacity group-hover:text-sky-600 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100"
                    aria-hidden
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
