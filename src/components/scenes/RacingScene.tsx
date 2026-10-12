import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function RacingScene({ children }: Props) {
  return (
    <div className="scene scene--racing">
      <div className="scene__sky scene__sky--race" aria-hidden="true">
        <div className="scene__sun">☀️</div>
        <div className="cloud cloud--1">☁️</div>
        <div className="cloud cloud--2">☁️</div>
      </div>

      <div className="race-hills" aria-hidden="true">
        <span className="race-hill race-hill--1" />
        <span className="race-hill race-hill--2" />
      </div>

      <div className="race-sign" aria-hidden="true">
        <span>🏁</span>
      </div>

      <div className="race-road" aria-hidden="true">
        <div className="race-road__dashes" />
      </div>

      <div className="scene__content">{children}</div>
    </div>
  );
}
