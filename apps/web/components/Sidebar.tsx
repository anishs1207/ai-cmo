"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconHome, IconMegaphone, IconBook } from "./icons";

const items = [
  { href: "/", label: "Dashboard", icon: IconHome },
  { href: "/campaigns", label: "Campaigns", icon: IconMegaphone },
  { href: "/kb", label: "Knowledge Base", icon: IconBook },
];

export function Sidebar({
  businessName,
  connected,
}: {
  businessName: string;
  connected: number;
}) {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">R</span>
        <span>
          <span className="brand-name">Ripple</span>
          <span className="brand-sub">organic autopilot</span>
        </span>
      </div>

      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`}>
            <Icon />
            {label}
          </Link>
        );
      })}

      <div className="sidebar-foot">
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>{businessName}</div>
        <div className="caption" style={{ fontSize: 11.5 }}>
          {connected > 0 ? "Reddit ready" : "Reddit not configured"}
        </div>
      </div>
    </aside>
  );
}
