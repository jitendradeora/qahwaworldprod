'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/localization';
import { Article } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface SearchContentProps {
  initialResults: Article[];
  locale: string;
  categories: string[];
}

export const SearchContent: React.FC<SearchContentProps> = ({ 
  initialResults, 
  locale,
  categories 
}) => {
  const getPath = (path: string) => getLocalizedPath(path, locale);
  const [results, setResults] = useState<Article[]>(initialResults);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (selectedCategory === 'All') {
      setResults(initialResults);
    } else {
      setResults(initialResults.filter(a => a.category === selectedCategory));
    }
  }, [selectedCategory, initialResults]);

  return (
    <>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'bg-amber-700 hover:bg-amber-800' : ''}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No articles found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((article) => (
            <Link
              key={article.id}
              href={`/${locale}/article/${article.id}`}
              className="group bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-4 left-4 bg-amber-700 hover:bg-amber-800">
                  {article.category}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                  <span>{article.date}</span>
                </div>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {article.tags.slice(0, 3).map((tag) => (
                      <Link
                        key={tag}
                        href={`/${locale}/tag/${tag}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Badge variant="outline" className="text-xs hover:bg-accent">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
};
