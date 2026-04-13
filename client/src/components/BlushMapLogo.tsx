// Shared constellation face logo — matches the reference image (face profile + gold star nodes)
export function BlushMapLogoInline({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size * (72/56)} viewBox="0 0 56 72" fill="none" aria-label="BlushMap">
      {/* Face outline */}
      <path d="M28 4 C20 4 15 10 14 17 C13 22 14 26 13 30 C12 35 11 39 13 44 C15 50 20 54 26 56 C29 57 31 56 32 54"
        stroke="#c9944a" strokeWidth="0.9" fill="none" strokeLinecap="round" opacity="0.45"/>
      <path d="M19 24 C21 22 24 22 26 24" stroke="#c9944a" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M21 48 C23 50 26 50 28 48" stroke="#c9944a" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.45"/>
      {/* Constellation lines */}
      <line x1="22" y1="10" x2="30" y2="8"  stroke="#c9944a" strokeWidth="0.75" opacity="0.6" strokeLinecap="round"/>
      <line x1="30" y1="8"  x2="38" y2="14" stroke="#c9944a" strokeWidth="0.75" opacity="0.6" strokeLinecap="round"/>
      <line x1="38" y1="14" x2="36" y2="22" stroke="#c9944a" strokeWidth="0.75" opacity="0.5" strokeLinecap="round"/>
      <line x1="36" y1="22" x2="28" y2="20" stroke="#c9944a" strokeWidth="0.75" opacity="0.5" strokeLinecap="round"/>
      <line x1="28" y1="20" x2="22" y2="10" stroke="#c9944a" strokeWidth="0.75" opacity="0.5" strokeLinecap="round"/>
      <line x1="28" y1="20" x2="30" y2="30" stroke="#c9944a" strokeWidth="0.7"  opacity="0.45" strokeLinecap="round"/>
      <line x1="30" y1="30" x2="36" y2="22" stroke="#c9944a" strokeWidth="0.7"  opacity="0.45" strokeLinecap="round"/>
      <line x1="30" y1="30" x2="24" y2="36" stroke="#c9944a" strokeWidth="0.7"  opacity="0.4" strokeLinecap="round"/>
      <line x1="24" y1="36" x2="18" y2="30" stroke="#c9944a" strokeWidth="0.7"  opacity="0.4" strokeLinecap="round"/>
      <line x1="18" y1="30" x2="28" y2="20" stroke="#c9944a" strokeWidth="0.7"  opacity="0.4" strokeLinecap="round"/>
      <line x1="24" y1="36" x2="26" y2="46" stroke="#c9944a" strokeWidth="0.65" opacity="0.35" strokeLinecap="round"/>
      <line x1="26" y1="46" x2="32" y2="42" stroke="#c9944a" strokeWidth="0.65" opacity="0.35" strokeLinecap="round"/>
      <line x1="32" y1="42" x2="30" y2="30" stroke="#c9944a" strokeWidth="0.65" opacity="0.35" strokeLinecap="round"/>
      {/* Crown star */}
      <circle cx="30" cy="8"  r="4.5" fill="#c9944a" opacity="0.1"/>
      <circle cx="30" cy="8"  r="2.8" fill="#c9944a" opacity="0.2"/>
      <circle cx="30" cy="8"  r="1.6" fill="#c9944a"/>
      <line x1="30" y1="4.5" x2="30" y2="11.5" stroke="#c9944a" strokeWidth="0.6" opacity="0.5"/>
      <line x1="26.5" y1="8" x2="33.5" y2="8" stroke="#c9944a" strokeWidth="0.6" opacity="0.5"/>
      {/* Forehead */}
      <circle cx="38" cy="14" r="3.5" fill="#c9944a" opacity="0.12"/>
      <circle cx="38" cy="14" r="1.4" fill="#c9944a"/>
      <line x1="38" y1="11.2" x2="38" y2="16.8" stroke="#c9944a" strokeWidth="0.5" opacity="0.45"/>
      <line x1="35.2" y1="14" x2="40.8" y2="14" stroke="#c9944a" strokeWidth="0.5" opacity="0.45"/>
      <circle cx="22" cy="10" r="1.2" fill="#c9944a" opacity="0.7"/>
      {/* Eye zone */}
      <circle cx="36" cy="22" r="3.2" fill="#c9944a" opacity="0.12"/>
      <circle cx="36" cy="22" r="1.3" fill="#c9944a"/>
      {/* Nose */}
      <circle cx="28" cy="20" r="2.8" fill="#c9944a" opacity="0.12"/>
      <circle cx="28" cy="20" r="1.2" fill="#c9944a" opacity="0.85"/>
      {/* Cheek */}
      <circle cx="30" cy="30" r="3"   fill="#c9944a" opacity="0.1"/>
      <circle cx="30" cy="30" r="1.3" fill="#c9944a" opacity="0.8"/>
      {/* Jaw area */}
      <circle cx="18" cy="30" r="1"   fill="#c9944a" opacity="0.6"/>
      <circle cx="24" cy="36" r="2.5" fill="#c9944a" opacity="0.1"/>
      <circle cx="24" cy="36" r="1.1" fill="#c9944a" opacity="0.75"/>
      <circle cx="26" cy="46" r="2"   fill="#c9944a" opacity="0.1"/>
      <circle cx="26" cy="46" r="1"   fill="#c9944a" opacity="0.6"/>
      <circle cx="32" cy="42" r="1"   fill="#c9944a" opacity="0.55"/>
      {/* Micro stars */}
      <circle cx="42" cy="32" r="0.7" fill="#c9944a" opacity="0.4"/>
      <circle cx="15" cy="42" r="0.6" fill="#c9944a" opacity="0.3"/>
      <circle cx="44" cy="20" r="0.5" fill="#c9944a" opacity="0.35"/>
      <circle cx="12" cy="20" r="0.5" fill="#c9944a" opacity="0.3"/>
    </svg>
  );
}
