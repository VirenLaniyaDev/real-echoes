import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Echoes",
  description: "Share your honest feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
