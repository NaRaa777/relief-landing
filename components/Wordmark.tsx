export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
        <path d="M12 3.5a8.5 8.5 0 0 1 8 5.7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-2xl leading-none tracking-tight">Relief</span>
    </span>
  );
}
