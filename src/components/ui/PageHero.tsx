import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow: string;
  title: string;
  /** Italic pink words appended to the title */
  accent?: string;
  description?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

/** Consistent page header: eyebrow, serif headline with accent, intro, actions. */
export default function PageHero({
  eyebrow,
  title,
  accent,
  description,
  children,
  align = "left",
  className = "",
}: PageHeroProps) {
  const centered = align === "center";

  return (
    <header className={`${centered ? "mx-auto text-center" : ""} max-w-4xl pb-10 pt-6 md:pb-14 md:pt-10 ${className}`}>
      <p className={`inline-flex items-center gap-2 text-sm font-bold text-pink-700`}>
        <span className="h-1.5 w-1.5 rounded-full bg-pink-600" />
        {eyebrow}
      </p>

      <h1 className="mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl">
        {title}
        {accent ? (
          <>
            {" "}
            <em>{accent}</em>
          </>
        ) : null}
      </h1>

      {description ? (
        <p className={`mt-6 max-w-2xl text-lg leading-8 text-[#6b4a4a] ${centered ? "mx-auto" : ""}`}>
          {description}
        </p>
      ) : null}

      {children ? (
        <div className={`mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 ${centered ? "justify-center" : ""}`}>
          {children}
        </div>
      ) : null}
    </header>
  );
}
