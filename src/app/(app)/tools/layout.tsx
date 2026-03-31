import { ToolsNav } from "@/components/nav/section-nav";
import { ToolsSidebar } from "@/components/nav/tools-sidebar";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WireframeDefault>
      <Providers>
        <ToolsSidebar />
        <ToolsNav />
        {children}
      </Providers>
    </WireframeDefault>
  );
}
