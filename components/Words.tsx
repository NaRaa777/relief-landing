import { Fragment } from "react";

export type Segment = { text: string; em?: boolean };

/** Splits text into words that light up in sequence (see `[data-words]`). */
export function Words({ segments }: { segments: Segment[] }) {
  let i = 0;
  return segments.map((segment, s) => {
    const words = segment.text.split(" ").filter(Boolean);
    const spans = words.map((word, w) => (
      <Fragment key={w}>
        <span className="word" style={{ "--i": i++ } as React.CSSProperties}>
          {word}
        </span>{" "}
      </Fragment>
    ));
    return segment.em ? (
      <em key={s} className="text-wine">
        {spans}
      </em>
    ) : (
      <Fragment key={s}>{spans}</Fragment>
    );
  });
}
