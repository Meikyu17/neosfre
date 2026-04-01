import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata = {
  title: "Neosfere | Studio de création sonore",
  description:
    "Neosfere, studio de création sonore. Composition, mixage et performances live dans une direction minimaliste et luxury tech.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={interTight.variable}>{children}</body>
    </html>
  );
}
