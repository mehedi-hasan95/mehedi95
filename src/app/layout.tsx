import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { AnimationProvider } from "./(home)/_components/home/animation-provider";
import { Navigation } from "./(home)/_components/home/navigation";
import { Footer } from "@/components/common/footer";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mehedi Hasan",
  description:
    "I build modern web applications with Next.js, React, and cutting-edge technologies. Passionate about performance, accessibility, and exceptional user experiences.",
  authors: [{ name: "Mehedi Hasan", url: "https://mehedi95.vercel.app" }],
  keywords: [
    "Next.js",
    "React",
    "Web Development",
    "Performance",
    "Accessibility",
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Mehedi Hasan",
    description:
      "I build modern web applications with Next.js, React, and cutting-edge technologies. Passionate about performance, accessibility, and exceptional user experiences.",
    url: "https://mehedi95.vercel.app",
    siteName: "Mehedi Hasan",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Mehedi Hasan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mehedi Hasan",
    description:
      "I build modern web applications with Next.js, React, and cutting-edge technologies. Passionate about performance, accessibility, and exceptional user experiences.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "Mehedi Hasan",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  alternates: {
    canonical: "https://mehedi95.vercel.app",
    types: {
      "application/rss+xml": "/feed.xml",
      "application/atom+xml": "/atom.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.userInfo.myInfo.queryOptions());
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnimationProvider>
          <TRPCReactProvider>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">{children}</main>
                <Suspense fallback={<p>Loading...</p>}>
                  <Footer />
                </Suspense>
              </div>
            </HydrationBoundary>
          </TRPCReactProvider>
        </AnimationProvider>

        <Toaster richColors />
      </body>
    </html>
  );
}
