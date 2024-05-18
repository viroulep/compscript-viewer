import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import type { Metadata, Viewport } from "next";

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import CssBaseline from '@mui/material/CssBaseline';

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
}

export const metadata: Metadata = {
  title: "Compscript Viewer",
  description: "View team data from compscript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CssBaseline />
      <body>
        <AppRouterCacheProvider>
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
