import type { Metadata } from "next";
import { Suspense } from "react";
import { UnsubscribeForm } from "@/components/EmailPages";
import { MessageShell } from "@/components/MessageShell";

export const metadata: Metadata = {
  title: "Unsubscribe — Relief",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <MessageShell>
      <Suspense>
        <UnsubscribeForm />
      </Suspense>
    </MessageShell>
  );
}
