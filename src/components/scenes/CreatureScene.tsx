import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function CreatureScene({ children }: Props) {
  return (
    <div className="scene scene--creatures">
      <div className="scene__sky" aria-hidden="true">
        <div className="scene__sun">🌤️</div>
        <div className="cloud cloud--1">☁️</div>
        <div className="cloud cloud--2">☁️</div>
      </div>

      <div className="fairy-hills" aria-hidden="true">
        <span className="fairy-hill fairy-hill--1" />
        <span className="fairy-hill fairy-hill--2" />
      </div>

      <div className="fairy-woods" aria-hidden="true">
        <span className="fairy-tree fairy-tree--1">🌳</span>
        <span className="fairy-tree fairy-tree--2">🌲</span>
        <span className="fairy-tree fairy-tree--3">🌳</span>
        <span className="fairy-mushroom">🍄</span>
        <span className="fairy-spark fairy-spark--1">✨</span>
        <span className="fairy-spark fairy-spark--2">✨</span>
        <span className="fairy-spark fairy-spark--3">✨</span>
      </div>

      <div className="scene__content">{children}</div>
    </div>
  );
}
