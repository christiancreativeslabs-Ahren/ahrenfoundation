import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Email Template Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          The requested email template does not exist.
        </p>
        <Link
          href="/email-preview"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          View All Templates
        </Link>
      </div>
    </div>
  );
}
