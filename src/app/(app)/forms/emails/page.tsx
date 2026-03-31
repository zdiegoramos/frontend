import { FormsNav } from "@/components/nav/section-nav";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";
import { ContactEmailsForm } from "./contact-emails-form";

export default function ContactEmailsPage() {
  return (
    <WireframeDefault>
      <Providers>
        <FormsNav />
        <main className="mx-auto max-w-lg p-8">
          <ContactEmailsForm />
        </main>
      </Providers>
    </WireframeDefault>
  );
}
