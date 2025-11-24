'use client';

import React from 'react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/localization';
import { Article } from '../../types';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ArticleListProps {
  articles: Article[];
  locale: string;
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles, locale }) => {
  const getPath = (path: string) => getLocalizedPath(path, locale);
  
  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/${locale}/article/${article.id}`}
          className="group flex gap-6 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-80 h-48 relative overflow-hidden flex-shrink-0">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 p-6 flex flex-col">
            <div className="mb-2">
              <Badge className="bg-amber-700 hover:bg-amber-800">
                {article.category}
              </Badge>
            </div>
            <h3 className="font-bold text-2xl mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
              {article.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
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
