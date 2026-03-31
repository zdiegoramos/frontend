import { ToolsSidebar } from "@/components/nav/tools-sidebar";
import { Wireframe } from "@/components/ui/wireframe";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wireframe
      config={{
        corners: {
          topLeft: "navbar",
          bottomLeft: "navbar",
        },
      }}
    >
      <ToolsSidebar />
      <div className="px-4 pt-4">{children}</div>
    </Wireframe>
  );
}
