import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function JurassicScene({ children }: Props) {
  return (
    <div className="scene scene--jurassic">
      <div className="scene__sky" aria-hidden="true">
        <div className="scene__sun scene__sun--warm">🌤️</div>
        <div className="cloud cloud--1">☁️</div>
        <div className="cloud cloud--2">☁️</div>
      </div>

      <div className="volcano" aria-hidden="true">
        <span className="volcano__smoke volcano__smoke--1" />
        <span className="volcano__smoke volcano__smoke--2" />
        <span className="volcano__smoke volcano__smoke--3" />
      </div>

      <div className="mountains mountains--jungle" aria-hidden="true">
        <span className="mountain mountain--back" />
        <span className="mountain mountain--mid" />
      </div>

      <div className="jungle" aria-hidden="true">
        <span className="fern fern--1">🌿</span>
        <span className="fern fern--2">🌴</span>
        <span className="fern fern--3">🌿</span>
        <span className="fern fern--4">🍃</span>
        <span className="fern fern--5">🌱</span>
      </div>

      <div className="scene__ground scene__ground--jungle" aria-hidden="true" />

      <div className="scene__content">{children}</div>
    </div>
  );
}
