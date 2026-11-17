import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-plum-deep px-5 pt-12 pb-[calc(max(32px,env(safe-area-inset-bottom))+16px)] text-cream sm:px-8 md:pb-0">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-md text-[15px] leading-relaxed text-cream/85">
            Relief is a wellness app in development. It is not a medical service
            and does not diagnose or treat any condition. If your period pain is
            severe, talk to a doctor.
          </p>
          <nav aria-label="Footer">
            {/* No side padding: "Privacy" lines up with the disclaimer's left edge. */}
            <ul className="flex gap-6 text-base">
              <li>
                <Link href="/privacy" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  Privacy
                </Link>
              </li>
              {site.contactEmail && (
                <li>
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
                  >
                    Contact
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </div>

        <p
          aria-hidden="true"
          className="display mt-10 hidden text-center text-[30vw] leading-[0.8] text-burgundy select-none md:-mb-[0.2em] md:block 2xl:text-[28rem]"
        >
          Relief
        </p>
      </div>
    </footer>
  );
}
