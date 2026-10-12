import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function WorkshopScene({ children }: Props) {
  return (
    <div className="scene scene--workshop">
      <div className="workshop__wall" aria-hidden="true">
        <span className="peg peg--1">🔧</span>
        <span className="peg peg--2">🔨</span>
        <span className="peg peg--3">🪛</span>
        <span className="peg peg--4">🪚</span>
        <span className="workshop__lamp">💡</span>
      </div>

      <div className="workshop__bench" aria-hidden="true">
        <span className="bench-tool">🧰</span>
        <span className="bench-tool">📐</span>
        <span className="bench-tool">🔩</span>
      </div>

      <div className="scene__content">{children}</div>
    </div>
  );
}
