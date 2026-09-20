import type { Metadata } from "next";
import { Nunito, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/auth/AuthProvider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zayka AI — Har Dish, Har Dil",
  description:
    "AI-powered cooking assistant jo aapko har dish banana sikhata hai. Live chef avatar, camera analysis, voice guidance aur bahut kuch!",
  keywords: "cooking, recipe, AI chef, Hindi recipes, Indian food, cooking assistant",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zayka AI",
  },
  openGraph: {
    title: "Zayka AI — Har Dish, Har Dil",
    description: "AI-powered Desi Cooking Assistant",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#F97316",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${nunito.variable} ${inter.variable}`}>
      <body
        className={nunito.className}
        style={{ backgroundColor: "#0A0A0A", display: "flex", justifyContent: "center", minHeight: "100vh" }}
      >
        <div 
          className="w-full relative shadow-2xl shadow-orange-900/40 overflow-x-hidden border-x border-white/10"
          style={{ maxWidth: "440px", minHeight: "100vh", backgroundColor: "#FFF8F3", color: "#3D2B1F" }}
        >
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1C1009",
                color: "#FFF8F3",
                border: "1px solid #F97316",
                borderRadius: "16px",
                fontFamily: "Nunito, sans-serif",
                fontWeight: "700",
                fontSize: "14px",
                padding: "12px 20px",
                boxShadow: "0 8px 32px rgba(249, 115, 22, 0.25)",
              },
              success: {
                iconTheme: { primary: "#F97316", secondary: "#FFF8F3" },
              },
              error: {
                iconTheme: { primary: "#FB7185", secondary: "#FFF8F3" },
              },
            }}
          />
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
