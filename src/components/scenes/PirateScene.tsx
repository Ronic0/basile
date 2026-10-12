import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function PirateScene({ children }: Props) {
  return (
    <div className="scene scene--pirates">
      <div className="scene__sky" aria-hidden="true">
        <div className="scene__sun">☀️</div>
        <div className="cloud cloud--1">☁️</div>
        <div className="cloud cloud--2">☁️</div>
      </div>

      <div className="scene__sea" aria-hidden="true">
        <div className="wave wave--1" />
        <div className="wave wave--2" />
      </div>

      <div className="scene__island" aria-hidden="true">
        <span className="island__palm">🌴</span>
      </div>

      <div className="scene__boat" aria-hidden="true">
        <span className="boat__hull">⛵</span>
      </div>

      <div className="scene__content">{children}</div>
    </div>
  );
}
