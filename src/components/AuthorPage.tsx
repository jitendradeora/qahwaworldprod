'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { User, FileText } from 'lucide-react';

interface AuthorPageProps {
  authorId?: string;
}

export const AuthorPage: React.FC<AuthorPageProps> = ({ authorId }) => {
  const { t, language } = useLanguage();
  const params = useParams() as { locale?: string };
  const locale = params?.locale || 'en';

  // Mock author data - replace with your actual data source
  const author = {
    id: authorId || '1',
    name: language === 'ar' ? 'اسم الكاتب' : language === 'ru' ? 'Имя автора' : 'Author Name',
    role: language === 'ar' ? 'كاتب قهوة' : language === 'ru' ? 'Кофейный писатель' : 'Coffee Writer',
    bio: language === 'ar' 
      ? 'كاتب متخصص في عالم القهوة والثقافة المتعلقة بها. يكتب مقالات عن أنواع القهوة المختلفة وطرق تحضيرها.'
      : language === 'ru'
      ? 'Писатель, специализирующийся на мире кофе и связанной с ним культуре. Пишет статьи о различных видах кофе и способах его приготовления.'
      : 'A writer specializing in the world of coffee and its related culture. Writes articles about different types of coffee and brewing methods.',
    articles: 12
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* Author Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 bg-amber-700 rounded-full flex items-center justify-center text-white text-5xl shrink-0">
              {author.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl mb-2 text-gray-900 dark:text-white">{author.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{author.role}</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{author.bio}</p>
              <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>
                    {author.articles} {language === 'ar' ? 'مقال' : language === 'ru' ? 'статей' : 'articles'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author Articles */}
        <div className="mb-6">
          <h2 className="text-2xl mb-4 text-gray-900 dark:text-white">
            {language === 'ar' ? 'المقالات' : language === 'ru' ? 'Статьи' : 'Articles'}
          </h2>
        </div>
        
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            {language === 'ar' 
              ? 'لا توجد مقالات لهذا الكاتب حاليًا'
              : language === 'ru'
              ? 'В настоящее время у этого автора нет статей'
              : 'No articles available for this author currently'
            }
          </p>
          <Link
            href={`/${locale}`}
            className="mt-6 px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors inline-block"
          >
            {language === 'ar' ? 'العودة للرئيسية' : language === 'ru' ? 'Вернуться на главную' : 'Back to Home'}
          </Link>
        </div>
      </main>
    </div>
  );
};