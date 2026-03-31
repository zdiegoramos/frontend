import { Wireframe } from "@/components/ui/wireframe";

export function WireframeDefault({ children }: { children: React.ReactNode }) {
  return (
    <Wireframe
      config={{
        corners: {
          topLeft: "navbar",
          bottomLeft: "navbar",
        },
        safeAreas: true,
      }}
    >
      <div className="px-4 pt-4">{children}</div>
    </Wireframe>
  );
}
