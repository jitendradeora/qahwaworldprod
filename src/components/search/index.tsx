import React from 'react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/localization';
import { mockArticles } from '../../data/mockArticles';
import { ChevronRight } from 'lucide-react';
import { SEO } from '../SEO';
import { SearchContent } from './SearchContent';
import { getTranslations } from '@/lib/translations';

interface SearchResultsPageProps {
  query?: string;
  locale: string;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query = '', locale }) => {
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);
  
  // Perform search on server
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return [];
    }

    const lowerQuery = searchQuery.toLowerCase();
    return mockArticles.filter(article => {
      return (
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt.toLowerCase().includes(lowerQuery) ||
        article.content?.toLowerCase().includes(lowerQuery) ||
        article.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });
  };

  const results = performSearch(query);
  const categories = ['All', 'News', 'Coffee Community', 'Studies', 'Interview', 'Coffee Reflections'];

  return (
    <>
      <SEO 
        title={`Search${query ? `: ${query}` : ''} - Qahwa World`}
        description={`Search results for "${query}" on Qahwa World - ${results.length} articles found`}
        keywords={`search, coffee articles, ${query}`}
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
              <span className="text-gray-900 dark:text-gray-100">{t.searchResults}</span>
            </div>
          </div>
        </div>

        {/* Search Header */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                {t.searchResults}
              </h1>
              {query && (
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="container mx-auto px-4 py-8">
          <SearchContent 
            initialResults={results} 
            locale={locale}
            categories={categories}
          />
        </div>
      </div>
    </>
  );
};

export { SearchResultsPage };
