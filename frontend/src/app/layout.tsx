import type { Metadata } from "next";
import { nunito } from "@/lib/fonts";
import StoreProvider from "@/app/StoreProvider";
import "@/assets/index.css";
import 'react-toastify/ReactToastify.min.css';

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
