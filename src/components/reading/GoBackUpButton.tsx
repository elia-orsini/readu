"use client";

import useWindowScroll from "@/hooks/useWindowScroll";

export default function GoBackUpButton() {
  const scroll = useWindowScroll();

  function topFunction() {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  return (
    <div>
      <button
        onClick={topFunction}
        className={`${scroll && scroll > 300 ? "fixed" : "hidden"} hover:bg-secondary bottom-10 right-10 z-40 flex h-10 w-10 max-w-xl rotate-[270deg] rounded-full border border-foreground bg-background p-0 px-2 font-semibold text-[var(--foreground)] transition-colors duration-500 xl:bottom-12 xl:right-14 xl:h-16 xl:w-16`}
      >
        <svg
          className={`duration-2000 transition-transform ease-in-out`}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          width="100%"
          height="100%"
        >
          <path
            fillRule="evenodd"
            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708l3.146-3.147H1.5A.5.5 0 0 1 1 8z"
          />
        </svg>
      </button>
    </div>
  );
}
