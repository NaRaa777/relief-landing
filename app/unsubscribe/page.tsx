import type { Metadata } from "next";
import { Suspense } from "react";
import { UnsubscribeForm } from "@/components/EmailPages";
import { MessageShell } from "@/components/MessageShell";
import { PhoneStage } from "@/components/PageArt";

export const metadata: Metadata = {
  title: "Unsubscribe — Relief",
  robots: { index: false, follow: false },
};

export default function UnsubscribePage() {
  return (
    <MessageShell art={<PhoneStage screen="none" />}>
      <Suspense>
        <UnsubscribeForm />
      </Suspense>
    </MessageShell>
  );
}
