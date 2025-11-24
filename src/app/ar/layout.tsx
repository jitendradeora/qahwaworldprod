import { LanguageProvider } from '@/contexts/LanguageContext';
import { Language } from '@/types';

export const metadata = {
  title: 'Qahwa World - Coffee Culture & News',
  description: 'Discover the latest coffee news, brewing techniques, and stories from around the world.',
};

export default function ArLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = 'ar' as Language;
  
  return (
    <LanguageProvider initialLanguage={lang}>
      {children}
    </LanguageProvider>
  );
}
