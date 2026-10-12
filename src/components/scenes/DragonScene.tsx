import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function DragonScene({ children }: Props) {
  return (
    <div className="scene scene--dragons">
      <div className="scene__sky" aria-hidden="true">
        <div className="scene__sun">☀️</div>
        <div className="cloud cloud--1">☁️</div>
        <div className="cloud cloud--2">☁️</div>
        <div className="cloud cloud--3">☁️</div>
      </div>

      <div className="mountains" aria-hidden="true">
        <span className="mountain mountain--back" />
        <span className="mountain mountain--mid" />
        <span className="mountain mountain--front" />
      </div>

      <div className="scene__ground" aria-hidden="true" />

      <div className="scene__content">{children}</div>
    </div>
  );
}
