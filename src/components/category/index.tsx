import React from 'react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/localization';
import { mockArticles } from "../../data/mockArticles";
import { ChevronRight } from "lucide-react";
import { CategoryContent } from "./CategoryContent";
import { getTranslations, getCategoryTranslation } from "@/lib/translations";

interface CategoryPageProps {
  category: string;
  locale: string;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, locale }) => {
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);
  
  // Filter articles by category on server
  const articles = mockArticles.filter((a) => a.category === category);

  const categoryDescriptions: Record<string, { en: string; ar: string; ru: string }> = {
    News: {
      en: "Stay updated with the latest news and trends in the coffee industry",
      ar: "ابق على اطلاع بأحدث الأخبار والاتجاهات في صناعة القهوة",
      ru: "Будьте в курсе последних новостей и тенденций в кофейной индустрии",
    },
    "Coffee Community": {
      en: "Stories and insights from coffee communities around the world",
      ar: "قصص ورؤى من مجتمعات القهوة حول العالم",
      ru: "Истории и идеи от кофейных сообществ по всему миру",
    },
    Studies: {
      en: "Research and scientific findings about coffee and its effects",
      ar: "الأبحاث والنتائج العلمية حول القهوة وتأثيراتها",
      ru: "Исследования и научные открытия о кофе и его эффектах",
    },
    Interview: {
      en: "Exclusive interviews with coffee experts and industry leaders",
      ar: "مقابلات حصرية مع خبراء القهوة وقادة الصناعة",
      ru: "Эксклюзивные интервью с экспертами по кофе и лидерами отрасли",
    },
    "Coffee Reflections": {
      en: "Personal stories and reflections on coffee culture",
      ar: "قصص شخصية وتأملات حول ثقافة القهوة",
      ru: "Личные истории и размышления о кофейной культуре",
    },
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href={getPath(`/`)}
              className="hover:text-amber-700 dark:hover:text-amber-500"
            >
              {t.home}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">
              {getCategoryTranslation(category, locale)}
            </span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-3 text-gray-900 dark:text-gray-100">
            {getCategoryTranslation(category, locale)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            {categoryDescriptions[category]?.[locale as 'en' | 'ar' | 'ru'] || ''}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Banner Ad */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600 border dark:border-gray-600 p-6 mb-8 rounded-lg">
          <div className="flex items-center justify-center h-32 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              <span className="block mb-2 text-2xl">📢</span>
              <span className="block">Banner Advertisement</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">970x90</span>
            </div>
          </div>
        </div>

        {/* No Articles Message */}
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              No articles found in this category
            </h3>
            <Link
              href={getPath(`/`)}
              className="bg-amber-700 hover:bg-amber-800 px-4 py-2 inline-block text-white rounded-md"
            >
              {t.home}
            </Link>
          </div>
        ) : (
          <CategoryContent articles={articles} locale={locale} />
        )}
      </div>
    </div>
  );
};

export { CategoryPage };
