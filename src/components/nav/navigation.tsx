"use client";

import type { ReactNode } from "react";
import {
  ADMIN_NAV_ROUTES,
  type NavRoutes,
  USER_NAV_ROUTES,
} from "@/components/nav/config";
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav";
import { MobileTopNav } from "@/components/nav/mobile-top-nav";
import { NavLogoWithText } from "@/components/nav/nav-logo";
import { NavbarLinks } from "@/components/nav/navbar-links";
import { UserMenu } from "@/components/nav/user-menu";
import { WireframeNav } from "@/components/ui/wireframe";
import { cn } from "@/lib/utils";
import { useAppState } from "@/providers/app-state-provider";

function AppNavbar({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-between",
        "bg-background/95 backdrop-blur-md",
        "border-border/40 border-b",
        "px-4 md:px-6 lg:px-8",
        "shadow-sm",
        className
      )}
    >
      <NavLogoWithText />
      <nav className="flex h-full items-center gap-2 md:gap-4">
        {children}
        <div className="ml-2">
          <UserMenu />
        </div>
      </nav>
    </div>
  );
}

function Navigation({ routes }: { routes: NavRoutes }) {
  const { isMobile } = useAppState();

  return (
    <>
      {isMobile ? (
        <>
          {/* Mobile: Top nav with logo only */}
          <WireframeNav position="top">
            <MobileTopNav />
          </WireframeNav>

          {/* Mobile: Bottom nav with icons and user menu */}
          <WireframeNav position="bottom">
            <MobileBottomNav routes={routes} />
          </WireframeNav>
        </>
      ) : (
        // Desktop: Top nav with full navbar
        <WireframeNav position="top">
          <AppNavbar>
            <NavbarLinks routes={routes} />
          </AppNavbar>
        </WireframeNav>
      )}
    </>
  );
}

export function UserNavigation() {
  return <Navigation routes={USER_NAV_ROUTES} />;
}

export function AdminNavigation() {
  return <Navigation routes={ADMIN_NAV_ROUTES} />;
}
