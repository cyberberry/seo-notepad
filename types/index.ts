export type BuildUserPromptInput = {
    keyword: string;
    tone?: string;
    audience?: string;
    language?: string;
    titleCount?: number;
    metaCount?: number;
    sectionCount?: number;
};

export type OutlineSection = {
    heading: string;
    bullets: string[];
};

export type GeneratedSeoContent = {
    titles: string[];
    metaDescriptions: string[];
    outlineSections: OutlineSection[];
};

export type ActiveTab = "titles" | "meta" | "outline";

export type ResultsPanelProps = {
    content: GeneratedSeoContent;
    activeTab: ActiveTab;
    setActiveTab: (tab: ActiveTab) => void;
};