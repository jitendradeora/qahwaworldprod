'use client';

import { usePathname } from 'next/navigation';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Toaster } from '@/components/ui/sonner';
import { Language } from '@/types';

interface LocaleWrapperProps {
  children: React.ReactNode;
  header: React.ReactNode;
}

export function LocaleWrapper({ children, header }: LocaleWrapperProps) {
  const pathname = usePathname();
  
  // Detect locale from pathname
  let locale: Language = 'en';
  if (pathname.startsWith('/ar')) {
    locale = 'ar';
  } else if (pathname.startsWith('/ru')) {
    locale = 'ru';
  }
  
  return (
    <LanguageProvider initialLanguage={locale}>
      <div className="min-h-screen flex flex-col">
        {header}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <ScrollToTop />
      <Toaster />
    </LanguageProvider>
  );
}
