import { Inter } from 'next/font/google';
import './globals.css';
import GlobalErrorReporter from '../components/GlobalErrorReporter';
import Providers from '../components/Providers';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Exportmétricas',
  description: 'App Generada en Next',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang='es' className={inter.variable} suppressHydrationWarning>
      <body>
        <GlobalErrorReporter />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
