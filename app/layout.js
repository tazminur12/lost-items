import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Smart Lost-Item Recovery System",
  description: "Find your lost items or report found ones.",
};

// OOP: Component composition - root layout composes multiple child components
// OOP: Higher-order structure - wraps app with AuthProvider (abstraction)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${inter.className} antialiased min-h-screen flex flex-col bg-gray-50 text-gray-900`}
      >
        {/* OOP: Component wrapper with HOC pattern */}
        <AuthProvider>
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
