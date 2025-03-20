import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/lib/auth-provider";
import ToastProvider from "@/components/toast-provider";

// Configure Inter font with fallbacks and preloading disabled
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Oxygen',
    'Ubuntu',
    'Cantarell',
    'Fira Sans',
    'Droid Sans',
    'Helvetica Neue',
    'sans-serif'
  ]
});

export const metadata: Metadata = {
  title: "Agricultural Trial Plot Planning",
  description: "Plan, navigate, and collect data from experimental agricultural plots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}