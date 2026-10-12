interface Props {
  className?: string;
  color?: string;
}

/** Super-héros original, dessiné en SVG (aucune ressource externe). */
export function Hero({ className, color = "#e8543f" }: Props) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 28 L16 52 L21 72 L50 54 L79 72 L84 52 Z" fill={color} />
      <circle cx="50" cy="38" r="21" fill="#ffd9b3" />
      <path d="M29 33 h42 v7 a21 21 0 0 1 -42 0 z" fill={color} />
      <circle cx="43" cy="39" r="3.4" fill="#fff" />
      <circle cx="57" cy="39" r="3.4" fill="#fff" />
      <circle cx="43" cy="39" r="1.7" fill="#233" />
      <circle cx="57" cy="39" r="1.7" fill="#233" />
      <path d="M45 47 q5 4 10 0" stroke="#c96a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
