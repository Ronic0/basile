import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function HeroScene({ children }: Props) {
  return (
    <div className="scene scene--hero">
      <div className="scene__sky scene__sky--hero" aria-hidden="true">
        <div className="scene__sun">🌇</div>
        <div className="cloud cloud--1">☁️</div>
        <div className="cloud cloud--2">☁️</div>
      </div>

      <div className="hero-city" aria-hidden="true">
        <span className="hero-building hero-building--1" />
        <span className="hero-building hero-building--2" />
        <span className="hero-building hero-building--3" />
        <span className="hero-building hero-building--4" />
      </div>

      <div className="scene__ground scene__ground--hero" aria-hidden="true" />

      <div className="scene__content">{children}</div>
    </div>
  );
}
