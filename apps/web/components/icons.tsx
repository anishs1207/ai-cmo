export function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

export function IconMegaphone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 11 18-6v14L3 13v-2Z" />
      <path d="M7 13.5V19a1.5 1.5 0 0 0 3 0v-4" />
    </svg>
  );
}

export function IconBook() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15Z" />
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
    </svg>
  );
}

export function IconPlug() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2v6M15 2v6" />
      <path d="M6 8h12v4a6 6 0 0 1-6 6v0a6 6 0 0 1-6-6V8Z" />
      <path d="M12 18v4" />
    </svg>
  );
}

export function IconSpark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    </svg>
  );
}

export function PlatformBadge({ platform, size = 26 }: { platform: string; size?: number }) {
  const s = { width: size, height: size, borderRadius: size * 0.28, flexShrink: 0 } as const;
  if (platform === "instagram") {
    return (
      <span
        style={{
          ...s,
          display: "grid",
          placeItems: "center",
          background: "radial-gradient(120% 120% at 25% 90%, #fdc468 0%, #df4996 45%, #9b36b7 100%)",
          color: "#fff",
        }}
        aria-label="Instagram"
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
        </svg>
      </span>
    );
  }
  if (platform === "facebook") {
    return (
      <span
        style={{ ...s, display: "grid", placeItems: "center", background: "#1877f2", color: "#fff" }}
        aria-label="Facebook"
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 8.5V6.8c0-.8.5-1 1-1h2V2.5h-3c-2.5 0-4 1.9-4 4.1v1.9H7.5V12H10v9.5h4V12h2.7l.5-3.5H14Z" />
        </svg>
      </span>
    );
  }
  return (
    <span
      style={{ ...s, display: "grid", placeItems: "center", background: "#ff4500", color: "#fff" }}
      aria-label="Reddit"
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="13.5" r="6.5" opacity="0.001" />
        <path d="M21 12.3c0-.9-.7-1.6-1.6-1.6-.4 0-.8.2-1.1.4-1.1-.7-2.6-1.2-4.2-1.3l.9-2.8 2.4.6c0 .8.7 1.4 1.4 1.4.8 0 1.5-.7 1.5-1.5S19.6 6 18.8 6c-.6 0-1.1.3-1.3.8l-2.8-.7c-.2 0-.4.1-.5.3l-1.1 3.4c-1.7 0-3.3.5-4.5 1.3-.3-.3-.7-.4-1.1-.4-.9 0-1.6.7-1.6 1.6 0 .6.3 1.1.8 1.4v.5c0 2.7 3 4.8 6.8 4.8s6.8-2.1 6.8-4.8v-.5c.5-.3.8-.8.8-1.4ZM8.7 13.7c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1-.5 1.1-1.1 1.1-1.1-.5-1.1-1.1Zm6.6 3.1c-.8.8-2.2.8-3.3.8s-2.5 0-3.3-.8c-.1-.1-.1-.3 0-.5.1-.1.3-.1.5 0 .6.6 1.8.6 2.8.6s2.2 0 2.8-.6c.1-.1.3-.1.5 0 .1.2.1.4 0 .5Zm-.2-2c-.6 0-1.1-.5-1.1-1.1s.5-1.1 1.1-1.1 1.1.5 1.1 1.1-.5 1.1-1.1 1.1Z" />
      </svg>
    </span>
  );
}
