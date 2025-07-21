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
