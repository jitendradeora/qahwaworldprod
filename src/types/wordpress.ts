export interface Article {
  id: string;
  databaseId: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  modified: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  categories?: {
    nodes: Category[];
  };
  tags?: {
    nodes: Tag[];
  };
  coffeeCategories?: {
    nodes: Category[];
  };
  coffeeTags?: {
    nodes: Tag[];
  };
  author?: {
    node: Author;
  };
  articleDetails?: {
    readTime: string;
    featured: boolean;
  };
  seo?: {
    title: string;
    metaDesc: string;
    opengraphImage?: {
      sourceUrl: string;
    };
  };
  translations?: {
    slug: string;
    language: {
      code: string;
    };
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  description?: string;
  translations?: {
    slug: string;
    languageCode: string;
  }[];
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Author {
  name: string;
  slug: string;
  databaseId?: number;
  description?: string;
  avatar?: {
    url: string;
  };
  authorInfo?: {
    authorBioEn?: string;
    authorBioAr?: string;
    authorBioRu?: string;
    authorImage?: {
      node: {
        altText: string;
        sourceUrl: string;
      };
    };
  };
}
