import { FormsSidebar } from "@/components/nav/forms-sidebar";
import { FormsNav } from "@/components/nav/section-nav";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WireframeDefault>
      <Providers>
        <FormsSidebar />
        <FormsNav />
        {children}
      </Providers>
    </WireframeDefault>
  );
}
