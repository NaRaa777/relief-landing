"use client";

import { useEffect } from "react";
import { track } from "@/lib/client/analytics";

let sent = false;

/** Captures attribution and records one page_view per page load. */
export function Analytics() {
  useEffect(() => {
    if (sent) return;
    sent = true;
    track("page_view");
  }, []);
  return null;
}
