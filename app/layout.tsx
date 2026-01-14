import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from './context/LanguageContext';

export const metadata: Metadata = {
  title: 'World Autistic',
  description: 'Educational app for autism support',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
