import AlwaysWhiteHeader from "@/components/header/AlwaysWhiteHeader";
import Image from "next/image";
import Link from "next/link";

export default async function IndexPage() {
  return (
    <>
      <AlwaysWhiteHeader />

      <main className="flex h-dvh w-screen flex-col justify-between bg-white font-semibold sm:h-screen">
        <section className="bg-gray-50 py-4">
          <div className="mx-auto max-w-6xl px-1 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center md:flex-row">
              <Image
                src="/landing-img.png"
                alt="Readu Brings Friends Together Through Shared Reading Experiences. Annotate, Discuss, and Enjoy Books as a Group."
                className="m-auto"
                width={700}
                height={500}
              />
            </div>
          </div>
        </section>

        <section id="action button" className="flex flex-col border-y border-black py-20">
          <Link
            href="/upload"
            className="mx-auto rounded-md bg-black px-8 py-4 text-white transition-colors hover:bg-gray-800"
          >
            Start reading a book today
          </Link>
        </section>

        <section id="features" className="border-b border-black bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Features built for reading together
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-gray-600">
                Everything you need to make reading a social experience
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 text-black md:grid-cols-2">
              <div className="rounded-md border border-black bg-gray-50 p-3 shadow-md">
                <h3 className="text-xl font-semibold">Shared Reading</h3>
                <p className="mb-6 text-gray-600">
                  Read the same book simultaneously with your friends, keeping everyone on the same
                  page.
                </p>
              </div>

              <div className="rounded-md bg-gray-50 p-3 shadow-md">
                <h3 className="text-xl font-semibold">
                  <span className="opacity-50">Group Annotations</span>{" "}
                  <span className="rounded bg-gray-700 px-2 py-1 text-base text-white">SOON</span>
                </h3>
                <p className="mb-6 text-gray-600 opacity-50">
                  Highlight and comment on passages together, creating a shared understanding.
                </p>
              </div>

              <div className="rounded-md bg-gray-50 p-3 shadow-md">
                <h3 className="text-xl font-semibold">
                  <span className="opacity-50">Live Discussions</span>{" "}
                  <span className="rounded bg-gray-700 px-2 py-1 text-base text-white">SOON</span>
                </h3>
                <p className="mb-6 text-gray-600 opacity-50">
                  Chat in real-time as you read, or schedule book club meetings within the app.
                </p>
              </div>

              <div className="rounded-md border border-black bg-gray-50 p-3 shadow-md">
                <h3 className="text-xl font-semibold">Reading Progress</h3>
                <p className="mb-6 text-gray-600">
                  Track individual and group progress to stay motivated together.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                Ever thought about reading Tolstoy? <span className="underline">Now you can.</span>
              </h2>
              <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
                Tackle those intimidating classics with friends. Share the journey, break down
                complex passages together, and finally check those bucket-list books off your list.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Link href="/upload">
                  <button className="rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800">
                    Start a new book today
                  </button>
                </Link>
                {/* <button className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100">
                  See recommended classics →
                </button> */}
              </div>
            </div>

            {/* Placeholder for classic books carousel */}
            <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              {["War and Peace", "Anna Karenina", "Crime and Punishment", "Moby Dick"].map(
                (book) => (
                  <div
                    key={book}
                    className="flex h-48 items-center justify-center rounded-md bg-white p-6 shadow-sm"
                  >
                    <span className="text-center font-medium text-gray-700">{book}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <footer className="border-t border-black bg-white py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="border-gray-200">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Readu. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
