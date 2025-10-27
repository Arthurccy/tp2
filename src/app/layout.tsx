import "./globals.css";
import { Navbar } from "@/app/components/layout/Navbar";
import { Footer } from "@/app/components/layout/Footer";
import { ThemeProvider } from "@/app/context/ThemeContext";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";

export const metadata = {
  title: "TP1 - Gestion de Contenu",
  description: "Application de gestion de contenu avec Next.js, Zustand et Tailwind",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <ThemeProvider>
          <Navbar />
          <ProtectedRoute>
            <main className="flex-grow">
              {children}
            </main>
          </ProtectedRoute>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}