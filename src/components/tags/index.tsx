'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/lib/localization';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockArticles } from '../../data/mockArticles';
import { Article } from '../../types';
import { Badge } from '../ui/badge';
import { ChevronRight, Tag } from 'lucide-react';
import { SEO } from '../SEO';
import { Language } from '../../types';

const getCategoryTranslation = (category: string, language: Language): string => {
  const categoryTranslations: Record<string, { en: string; ar: string; ru: string }> = {
    'News': { en: 'News', ar: 'أخبار', ru: 'Новости' },
    'Coffee Community': { en: 'Coffee Community', ar: 'مجتمع القهوة', ru: 'Кофейное Сообщество' },
    'Studies': { en: 'Studies', ar: 'دراسات', ru: 'Исследования' },
    'Interview': { en: 'Interview', ar: 'حوارات', ru: 'Интервью' },
    'Coffee Reflections': { en: 'Coffee Reflections', ar: 'تأملات', ru: 'Размышления' },
  };
  return categoryTranslations[category]?.[language] || category;
};

interface TagsPageProps {
  tag?: string;
}

const TagsPage: React.FC<TagsPageProps> = ({ tag }) => {
  const { t, language } = useLanguage();
  const params = useParams() as { locale?: string };
  const locale = params?.locale || 'en';
  const router = useRouter();
  const getPath = (path: string) => getLocalizedPath(path, locale);
  const [allTags, setAllTags] = useState<{ tag: string; count: number }[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    // Get all unique tags with counts
    const tagMap = new Map<string, number>();
    mockArticles.forEach(article => {
      article.tags?.forEach(t => {
        tagMap.set(t, (tagMap.get(t) || 0) + 1);
      });
    });

    const tagsArray = Array.from(tagMap.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    setAllTags(tagsArray);

    // Filter articles by tag if specified
    if (tag) {
      const filtered = mockArticles.filter(a => a.tags?.includes(tag));
      setFilteredArticles(filtered);
    }
  }, [tag]);

  // If viewing specific tag
  if (tag) {
    return (
      <>
        <SEO 
          title={`#${tag} - Qahwa World`}
          description={`Browse ${filteredArticles.length} articles tagged with ${tag} on Qahwa World`}
          keywords={`coffee, ${tag}, articles, qahwa`}
        />
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link href={getPath(`/`)} className="hover:text-amber-700 dark:hover:text-amber-500">
                {t.home}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link href={getPath(`/tags`)} className="hover:text-amber-700 dark:hover:text-amber-500">
                {t.tags}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-gray-100">#{tag}</span>
            </div>
          </div>
        </div>

        {/* Tag Header */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-2">
              <Tag className="w-6 h-6 text-amber-700 dark:text-amber-400" />
              <h1 className="text-2xl text-amber-900 dark:text-amber-100">#{tag}</h1>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filteredArticles.length} {language === 'ar' ? 'مقالات موسومة بـ' : language === 'ru' ? 'статей с тегом' : 'articles tagged with'} "{tag}"
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={getPath(`/article/${article.id}`)}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden block"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-3">
                    {article.category}
                  </Badge>
                  <h3 className="text-xl mb-3 text-amber-900 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-500 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags?.slice(0, 3).map((t, index) => (
                      <span
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          router.push(getPath(`/tag/${encodeURIComponent(t)}`));
                        }}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-amber-900 text-gray-600 dark:text-gray-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors cursor-pointer"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{article.author}</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl text-gray-600 dark:text-gray-400">No articles found with this tag</h3>
            </div>
          )}
        </div>
      </div>
      </>
    );
  }

  // View all tags
  return (
    <>
      <SEO 
        title="All Tags - Qahwa World"
        description="Explore all article tags and topics on Qahwa World"
        keywords="coffee tags, topics, categories, qahwa"
      />
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href={getPath(`/`)} className="hover:text-amber-700 dark:hover:text-amber-500">
              {t.home}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 dark:text-gray-100">{t.tags}</span>
          </div>
        </div>
      </div>

      {/* Tags Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Tag className="w-6 h-6 text-amber-700 dark:text-amber-400" />
            <h1 className="text-2xl text-amber-900 dark:text-amber-100">{t.allTags}</h1>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {language === 'ar' ? 'استكشف المقالات حسب المواضيع والثيمات' : language === 'ru' ? 'Изучайте статьи по темам и мотивам' : 'Explore articles by topics and themes'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tags Cloud */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm p-8">
          <h2 className="text-2xl text-amber-900 dark:text-amber-100 mb-6">
            {language === 'ar' ? 'الوسوم الشائعة' : language === 'ru' ? 'Популярные Теги' : 'Popular Tags'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {allTags.map(({ tag: tagName, count }) => (
              <Link
                key={tagName}
                href={getPath(`/tag/${encodeURIComponent(tagName)}`)}
                className="group relative px-6 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-amber-50 dark:hover:bg-amber-900 border dark:border-gray-600 hover:border-amber-700 dark:hover:border-amber-600 transition-all"
                style={{
                  fontSize: `${Math.min(24, 14 + count * 2)}px`
                }}
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-amber-900 dark:group-hover:text-amber-100">
                  #{tagName}
                </span>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                  ({count})
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Banner Ad */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border p-6 mt-8">
          <div className="flex items-center justify-center h-32 text-center">
            <div className="text-sm text-gray-600">
              <span className="block mb-2 text-2xl">📰</span>
              <span className="block">Banner Advertisement</span>
              <span className="text-xs text-gray-500">970x90</span>
            </div>
          </div>
        </div>

        {/* Tags by Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {['News', 'Studies', 'Coffee Community', 'Interview', 'Coffee Reflections'].map(category => {
            const categoryTags = allTags.filter(({ tag: tagName }) => {
              return mockArticles.some(a => 
                a.category === category && a.tags?.includes(tagName)
              );
            });

            if (categoryTags.length === 0) return null;

            return (
              <div key={category} className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm p-6">
                <h3 className="text-xl text-amber-900 dark:text-amber-100 mb-4">{getCategoryTranslation(category, language)}</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryTags.slice(0, 6).map(({ tag: tagName, count }) => (
                    <Link
                      key={tagName}
                      href={getPath(`/tag/${encodeURIComponent(tagName)}`)}
                      className="px-4 py-2 bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-900 text-sm transition-colors"
                    >
                      #{tagName} <span className="text-xs text-gray-500">({count})</span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export { TagsPage };
