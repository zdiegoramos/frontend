import { FormsNav } from "@/components/nav/section-nav";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";
import { CreditCardForm } from "./credit-card-form";

export default function CreditCardPage() {
  return (
    <WireframeDefault>
      <Providers>
        <FormsNav />
        <main className="mx-auto max-w-lg p-8">
          <h1 className="mb-2 font-bold text-2xl">Payment Method</h1>
          <p className="mb-6 text-muted-foreground">
            All transactions are secure and encrypted.
          </p>
          <CreditCardForm />
        </main>
      </Providers>
    </WireframeDefault>
  );
}
