import type { Metadata } from 'next';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LocaleWrapper } from '@/components/LocaleWrapper';
import { Header } from '@/components/Header';
import { HtmlAttributes } from '@/components/HtmlAttributes';
import './globals.css';

export const metadata: Metadata = {
  title: 'Qahwa World - Coffee Culture & News',
  description: 'Discover the latest coffee news, brewing techniques, and stories from around the world.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <HtmlAttributes />
        <ThemeProvider>
          <LocaleWrapper header={<Header locale="en" language="en" />}>
            {children}
          </LocaleWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
