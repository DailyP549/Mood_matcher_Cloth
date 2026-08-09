import "./globals.css";

export const metadata = {
  title: "OutfitWise — Wear what you already own"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
