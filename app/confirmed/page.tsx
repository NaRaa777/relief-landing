import type { Metadata } from "next";
import { Suspense } from "react";
import { ConfirmedMessage } from "@/components/EmailPages";
import { MessageShell } from "@/components/MessageShell";
import { PhoneStage } from "@/components/PageArt";

export const metadata: Metadata = {
  title: "Email confirmed — Relief",
  robots: { index: false, follow: false },
};

export default function ConfirmedPage() {
  return (
    <MessageShell art={<PhoneStage screen="heads-up" />}>
      <Suspense>
        <ConfirmedMessage />
      </Suspense>
    </MessageShell>
  );
}
