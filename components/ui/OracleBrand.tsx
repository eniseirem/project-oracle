export function OracleBrand({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl sm:text-5xl",
  };
  return (
    <div className="text-center">
      <h1
        className={`font-display font-extrabold tracking-[0.25em] text-oracle-text ${sizes[size]}`}
      >
        PROJECT <span className="text-oracle-redBright">ORACLE</span>
      </h1>
    </div>
  );
}
