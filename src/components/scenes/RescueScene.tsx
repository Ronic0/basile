import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function RescueScene({ children }: Props) {
  return (
    <div className="scene scene--rescue">
      <div className="scene__sky" aria-hidden="true">
        <div className="scene__sun">🌤️</div>
        <div className="cloud cloud--1">☁️</div>
        <div className="cloud cloud--2">☁️</div>
      </div>

      <div className="city" aria-hidden="true">
        <span className="building building--1" />
        <span className="building building--2" />
        <span className="building building--3" />
        <span className="building building--4" />
      </div>

      <div className="river" aria-hidden="true">
        <div className="river__wave river__wave--1" />
        <div className="river__wave river__wave--2" />
      </div>

      <div className="bridge" aria-hidden="true">
        <span className="bridge__deck" />
        <span className="bridge__post bridge__post--1" />
        <span className="bridge__post bridge__post--2" />
      </div>

      <div className="scene__content">{children}</div>
    </div>
  );
}
