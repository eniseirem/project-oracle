export function Badge({ count }: { count: number }) {
  if (!count) return null;
  return (
    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-oracle-red text-white text-[10px] font-semibold px-2 py-0.5 tabular-nums">
      {count} NEW
    </span>
  );
}
