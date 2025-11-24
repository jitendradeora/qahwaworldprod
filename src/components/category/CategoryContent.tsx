'use client';

import React, { useState } from 'react';
import { Article } from '@/types';
import { ArticleGrid } from './ArticleGrid';
import { ArticleList } from './ArticleList';
import { ViewToggle } from './ViewToggle';

interface CategoryContentProps {
  articles: Article[];
  locale: string;
}

export const CategoryContent: React.FC<CategoryContentProps> = ({ articles, locale }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <>
      <div className="flex justify-end mb-6">
        <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {viewMode === 'grid' ? (
        <ArticleGrid articles={articles} locale={locale} />
      ) : (
        <ArticleList articles={articles} locale={locale} />
      )}
    </>
  );
};
