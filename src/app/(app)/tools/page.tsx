import Link from "next/link";
import { ToolsNav } from "@/components/nav/section-nav";
import { TOOLS_NAV } from "@/components/nav/tools";
import { ToolsSidebar } from "@/components/nav/tools-sidebar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";

export default function ToolsPage() {
  return (
    <WireframeDefault>
      <Providers>
        <ToolsSidebar />
        <ToolsNav />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="font-bold text-2xl">Tools</h1>
            <p className="text-muted-foreground text-sm">
              Browse the available utility tools in this codebase.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS_NAV.map((tool) => (
              <Link href={tool.href} key={tool.href}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="mb-2 flex size-9 items-center justify-center rounded-md bg-muted">
                      <tool.icon className="size-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-base">{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </main>
      </Providers>
    </WireframeDefault>
  );
}
