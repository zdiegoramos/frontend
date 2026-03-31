"use client";

import { usePathname, useRouter } from "next/navigation";
import { isRouteActive } from "@/components/nav/config";
import { WireframeNav } from "@/components/ui/wireframe";
import { useAppState } from "@/providers/app-state-provider";
import { FORMS_NAV } from "./forms";
import { TOOLS_NAV } from "./tools";

export type NavItem = {
  name: string;
  href: string;
  activePatterns: string[];
};

export function SectionNav({
  items,
  label,
}: {
  items: NavItem[];
  label: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isMobile } = useAppState();

  if (!isMobile) {
    return null;
  }

  const currentHref = items.find((item) =>
    isRouteActive(pathname, item.activePatterns)
  )?.href;

  return (
    <WireframeNav className="border-t bg-background" position="bottom">
      <div className="flex h-full items-center px-4">
        <label className="flex flex-1 items-center gap-2">
          <span className="shrink-0 font-medium text-muted-foreground text-sm">
            {label}:
          </span>
          <select
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            onChange={(e) => router.push(e.target.value)}
            value={currentHref ?? ""}
          >
            {items.map((item) => (
              <option key={item.href} value={item.href}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </WireframeNav>
  );
}

export function ToolsNav() {
  return (
    <SectionNav
      items={TOOLS_NAV.map(({ name, href, activePatterns }) => ({
        name,
        href,
        activePatterns,
      }))}
      label="Tool"
    />
  );
}

export function FormsNav() {
  return (
    <SectionNav
      items={FORMS_NAV.map(({ name, href, activePatterns }) => ({
        name,
        href,
        activePatterns,
      }))}
      label="Form"
    />
  );
}
