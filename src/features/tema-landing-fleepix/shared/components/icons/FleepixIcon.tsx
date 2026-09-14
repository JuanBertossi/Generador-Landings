interface FleepixIconProps {
  variant?: "dark" | "light";
  className?: string;
}

/**
 * Isotipo "F" de Fleepix (recorte del wordmark) para usos chicos: favicon, avatar, splash.
 * `variant="dark"` (letra navy) se usa sobre fondos claros, `variant="light"` (letra blanca) sobre fondos navy.
 */
export function FleepixIcon({ variant = "dark", className }: FleepixIconProps) {
  const mainFill = variant === "dark" ? "#002534" : "#FFFFFF";
  const accentFill = variant === "dark" ? "#0093D1" : "#43C7FF";

  return (
    <svg
      className={className}
      viewBox="50 -6 119 167"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Fleepix"
    >
      <path
        d="M158.866 0.421875C161.075 0.421875 162.866 2.21274 162.866 4.42188V35.6104C162.866 37.8195 161.075 39.6104 158.866 39.6104H60.6797C58.4705 39.6104 56.6797 37.8195 56.6797 35.6104V4.42187C56.6797 2.21274 58.4705 0.421875 60.6797 0.421875H158.866Z"
        fill={mainFill}
      />
      <path
        d="M151.067 108.086C151.067 110.295 149.277 112.086 147.067 112.086H97.7607C95.5516 112.086 93.7607 113.877 93.7607 116.086V150.645C93.7607 152.854 91.9699 154.645 89.7607 154.645H60.6797C58.4705 154.645 56.6797 152.854 56.6797 150.645V83.2188C56.6797 81.0096 58.4705 79.2188 60.6797 79.2188H147.067C149.277 79.2188 151.067 81.0096 151.067 83.2188V108.086Z"
        fill={mainFill}
      />
      <rect
        x="56.6797"
        y="44.6664"
        width="37.0809"
        height="29.4962"
        rx="4"
        fill={accentFill}
      />
    </svg>
  );
}
