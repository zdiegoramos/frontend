import { FormsNav } from "@/components/nav/section-nav";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";
import { CreateUserForm } from "./create-user-form";

export default function InputExamplePage() {
  return (
    <WireframeDefault>
      <Providers>
        <FormsNav />
        <main className="mx-auto max-w-lg p-8">
          <h1 className="mb-2 font-bold text-2xl">Input Examples</h1>
          <p className="mb-6 text-muted-foreground">
            Demonstrates the <code>TextInput</code> component with form
            validation.
          </p>
          <CreateUserForm />
        </main>
      </Providers>
    </WireframeDefault>
  );
}
