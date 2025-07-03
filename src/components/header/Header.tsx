import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-foreground bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex flex-row items-center">
              <Image
                src="/readu-sm-logo.png"
                alt="Readu Logo"
                width={200}
                height={200}
                className="ml-2 block h-4 w-8 dark:hidden"
              />
              <Image
                src="/readu-sm-logo-dark.png"
                alt="Readu Logo"
                width={200}
                height={200}
                className="ml-2 hidden h-4 w-8 dark:block"
              />
              <span className="ml-2 text-xl font-semibold text-[var(--foreground)]">Readu </span>
              <p className="ml-2 mt-0.5 inline rounded bg-[var(--foreground)] px-2 text-sm text-background">
                BETA
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
