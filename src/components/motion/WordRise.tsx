import type { CSSProperties } from "react";

type WordRiseProps = {
  text: string;
  /** Optional words appended in italic accent style (rendered inside <em>) */
  accent?: string;
  /** Delay before the first word, in ms */
  startDelay?: number;
  /** Gap between words, in ms */
  stagger?: number;
};

/** Splits text into words that slide up one by one on page load. */
export default function WordRise({ text, accent, startDelay = 0, stagger = 70 }: WordRiseProps) {
  const plain = text.split(" ").filter(Boolean);
  const accented = accent ? accent.split(" ").filter(Boolean) : [];
  const total = plain.length + accented.length;

  const word = (w: string, i: number) => (
    <span key={`${w}-${i}`}>
      <span className="word-rise">
        <span style={{ "--word-delay": `${startDelay + i * stagger}ms` } as CSSProperties}>{w}</span>
      </span>
      {i < total - 1 ? " " : null}
    </span>
  );

  return (
    <>
      <span className="sr-only">{accent ? `${text} ${accent}` : text}</span>
      <span aria-hidden="true">
        {plain.map((w, i) => word(w, i))}
        {accented.length > 0 && <em>{accented.map((w, i) => word(w, plain.length + i))}</em>}
      </span>
    </>
  );
}
