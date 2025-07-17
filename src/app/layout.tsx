import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import { AnimationProvider } from "./(home)/_components/home/animation-provider";
import { Navigation } from "./(home)/_components/home/navigation";
import { Footer } from "@/components/common/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MehediFi-Better auth",
  description: "Mehedi is my owner",
  authors: [{ name: "Mehedi Hasan", url: "https://mehedi95.vercel.app" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AnimationProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </main>
            <Footer />
          </div>
        </AnimationProvider>

        <Toaster richColors />
      </body>
    </html>
  );
}
