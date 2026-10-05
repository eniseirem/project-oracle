import Link from "next/link";
import { OracleBrand } from "@/components/ui/OracleBrand";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="animate-fadeIn">
        <OracleBrand size="lg" />
        <p className="mt-3 font-display uppercase tracking-[0.3em] text-oracle-amber text-sm">
          Final Assessment
        </p>
        <p className="mt-6 text-oracle-textDim text-xs max-w-xs mx-auto leading-relaxed">
          A private behavioral experiment.
          <span className="cursor-blink text-oracle-textDim" />
        </p>
      </div>

      <div className="mt-14 w-full max-w-xs space-y-3">
        <Link
          href="/join"
          className="block w-full text-center font-display font-semibold uppercase tracking-wide text-sm px-5 py-4 rounded-sm border bg-oracle-red/90 border-oracle-red text-white active:scale-[0.98]"
        >
          Join Experiment
        </Link>
        <Link
          href="/host"
          className="block w-full text-center font-display font-semibold uppercase tracking-wide text-sm px-5 py-4 rounded-sm border bg-oracle-panel border-oracle-border text-oracle-text active:scale-[0.98]"
        >
          Game Master
        </Link>
      </div>

      <p className="mt-16 text-[10px] text-oracle-textFaint uppercase tracking-widest">
        already assigned a character? <Link href="/preview" className="underline">preview it</Link>
      </p>
      <p className="mt-3 text-[10px] text-oracle-textFaint uppercase tracking-widest">
        display screen: <Link href="/display" className="underline">/display</Link>
      </p>
    </main>
  );
}
