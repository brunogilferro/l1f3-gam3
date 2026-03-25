import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';
import { Providers } from './providers';

const bodyFont = Inter({
  variable: '--font-body',
  subsets: ['latin'],
});
const interFont = Inter({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'l1f3-gam3',
  description: 'l1f3-gam3',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${interFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
