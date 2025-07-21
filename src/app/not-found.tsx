import Link from "next/link";

const NotFound = async () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-extrabold text-blue-600 drop-shadow-lg animate-pulse">
          {"404"}
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-9xl font-extrabold text-blue-400 opacity-20 blur-sm">
            {"404"}
          </span>
        </div>
      </div>
      <h2 className="text-4xl font-bold mb-4 text-blue-500">
        {"Oops! Lost in the Digital Cosmos?"}
      </h2>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl">
        {
          "It looks like the page you're looking for has ventured off into uncharted territory. Don't worry, we'll help you find your way back."
        }
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-md bg-blue-600 px-8 py-3 text-lg font-medium text-white shadow-lg transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50"
        >
          {"Return to Homepage"}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
