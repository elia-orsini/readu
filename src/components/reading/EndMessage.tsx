"use client";

export default function EndMessage() {
  return (
    <div className="py-12 text-[var(--foreground)]">
      <p>Have you finished your reading for today?</p>
      <p>
        Don&apos;t forget to log it{" "}
        <button
          onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
          className="underline"
        >
          back at the top
        </button>
      </p>
    </div>
  );
}
