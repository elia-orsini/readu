import Link from "next/link";

export default async function IndexPage() {
  return (
    <main className="flex h-dvh w-screen flex-col justify-between font-semibold sm:h-screen">
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-10 md:mb-0 md:w-1/2">
              <h1 className="mb-6 text-5xl font-bold text-gray-900">
                Read together, <span className="text-blue-600">stay connected</span>
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                Readu brings friends together through shared reading experiences. Annotate, discuss,
                and enjoy books as a group.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Link href="/upload">
                  <button className="rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800">
                    Start reading with friends
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex h-96 items-center justify-center rounded-xl bg-gray-200 md:w-1/2">
              {/* Placeholder for hero image */}
              <span className="text-gray-500">Hero image placeholder</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Features built for reading together
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Everything you need to make reading a social experience
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-3 text-xl font-semibold">Shared Reading</h3>
              <p className="text-gray-600">
                Read the same book simultaneously with your friends, keeping everyone on the same
                page.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-3 text-xl font-semibold">
                <span className="opacity-50">Group Annotations</span>{" "}
                <span className="rounded bg-gray-700 px-2 py-1 text-base text-white">SOON</span>
              </h3>
              <p className="text-gray-600 opacity-50">
                Highlight and comment on passages together, creating a shared understanding.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-3 text-xl font-semibold">
                <span className="opacity-50">Live Discussions</span>{" "}
                <span className="rounded bg-gray-700 px-2 py-1 text-base text-white">SOON</span>
              </h3>
              <p className="text-gray-600 opacity-50">
                Chat in real-time as you read, or schedule book club meetings within the app.
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-3 text-xl font-semibold">Reading Progress</h3>
              <p className="text-gray-600">
                Track individual and group progress to stay motivated together.
              </p>
            </div>
          </div>

          <div className="mt-16 flex h-96 items-center justify-center rounded-xl bg-gray-200">
            {/* Placeholder for features screenshot */}
            <span className="text-gray-500">Features screenshot placeholder</span>
          </div>
        </div>
      </section>

      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Ever thought about reading Tolstoy?{" "}
              <span className="text-blue-600">Now you can.</span>
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              Tackle those intimidating classics with friends. Share the journey, break down complex
              passages together, and finally check those bucket-list books off your list.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="rounded-md bg-black px-6 py-3 text-white transition-colors hover:bg-gray-800">
                Start a new book today
              </button>
              <button className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-100">
                See recommended classics →
              </button>
            </div>
          </div>

          {/* Placeholder for classic books carousel */}
          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {["War and Peace", "Anna Karenina", "Crime and Punishment", "Moby Dick"].map((book) => (
              <div
                key={book}
                className="flex h-48 items-center justify-center rounded-lg bg-white p-6 shadow-sm"
              >
                <span className="text-center font-medium text-gray-700">{book}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div> */}
          <div className="border-gray-200">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Readu. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
