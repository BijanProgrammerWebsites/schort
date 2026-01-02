import { ReactElement, ReactNode } from "react";

import type { Metadata, Viewport } from "next";
import { Geologica } from "next/font/google";

import HeaderComponent from "@/app/components/header/header.component";
import FooterComponent from "@/app/components/footer/footer.component";

import AuthProvider from "@/app/providers/auth/auth.provider";
import AnimationProvider from "@/app/providers/animation/animation.provider";
import SnackbarProvider from "@/app/providers/snackbar/snackbar.provider";

import "./globals.scss";

const geologica = Geologica({ weight: ["400", "700"], subsets: ["latin"] });

const metadataTitle = "Schort";
const metadataDescription =
  "We can help you generate a short link from any URL. Short links are easier to share in social medias and they are also more likely to be remembered.";

export const metadata: Metadata = {
  metadataBase: new URL("https://schort.ir/"),
  title: metadataTitle,
  description: metadataDescription,
  robots: "index, follow",
  openGraph: {
    title: metadataTitle,
    description: metadataDescription,
    url: "https://schort.ir/",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    title: metadataTitle,
    description: metadataDescription,
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <html lang="en" prefix="og: http://ogp.me/ns#">
      <body className={geologica.className}>
        <AuthProvider>
          <AnimationProvider>
            <SnackbarProvider>
              <HeaderComponent />

              <main className="page-bleed">{children}</main>

              <FooterComponent />
            </SnackbarProvider>
          </AnimationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
