import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ahren Foundation — Tech Skills. Kingdom Purpose. Global Impact.",
  description: "Empowering youths through tech programs, mentorship, and strategic collaborations — aligning tech skills and creativity with God's purpose.",
  openGraph: { title: "Ahren Foundation", description: "Tech Skills. Kingdom Purpose. Global Impact.", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>{children}</body>
    </html>
  );
}
