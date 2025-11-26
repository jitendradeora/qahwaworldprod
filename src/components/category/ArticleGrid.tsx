'use client';

import React from 'react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/localization';
import { Article } from '../../types';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ArticleGridProps {
  articles: Article[];
  locale: string;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({ articles, locale }) => {
  const getPath = (path: string) => getLocalizedPath(path, locale);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={getPath(`/article/${article.id}`)}
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
          </div>
        </Link>
      ))}
    </div>
  );
};
