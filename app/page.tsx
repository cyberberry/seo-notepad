import HomePageClient from "@/components/HomePageClient";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.12),transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(24,24,27,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000,transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <HomePageClient />
      </div>
    </div>
  );
}
