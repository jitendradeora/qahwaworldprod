'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getLocalizedPath } from '@/lib/localization';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockArticles } from "../../data/mockArticles";
import { Article } from "../../types";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Clock,
  User,
  Calendar,
  ChevronRight,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { SEO } from "../SEO";
import { Language } from "../../types";

const getCategoryTranslation = (
  category: string,
  language: Language
): string => {
  const categoryTranslations: Record<
    string,
    { en: string; ar: string; ru: string }
  > = {
    News: { en: "News", ar: "أخبار", ru: "Новости" },
    "Coffee Community": {
      en: "Coffee Community",
      ar: "مجتمع القهوة",
      ru: "Кофейное Сообщество",
    },
    Studies: { en: "Studies", ar: "دراسات", ru: "Исследования" },
    Interview: { en: "Interview", ar: "حوارات", ru: "Интервью" },
    "Coffee Reflections": {
      en: "Coffee Reflections",
      ar: "تأملات",
      ru: "Размышления",
    },
  };
  return categoryTranslations[category]?.[language] || category;
};

interface ArticleDetailPageProps {
  articleId: string;
}

const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  articleId,
}) => {
  const { t, language } = useLanguage();
  const pathname = usePathname();

  // Detect locale from pathname - check for complete path segments
  let locale = 'en';
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    locale = 'ar';
  } else if (pathname === '/ru' || pathname.startsWith('/ru/')) {
    locale = 'ru';
  }

  const getPath = (path: string) => getLocalizedPath(path, locale);

  // Find the article immediately, not in useEffect
  const foundArticle = mockArticles.find((a) => a.id === articleId) || null;

  // Get related articles from the same category
  const related = foundArticle
    ? mockArticles
      .filter(
        (a) => a.id !== articleId && a.category === foundArticle.category
      )
      .slice(0, 5)
    : [];

  const [article] = useState<Article | null>(foundArticle);
  const [relatedArticles] = useState<Article[]>(related);
  const [loadedArticles, setLoadedArticles] = useState<Article[]>(related.slice(0, 1));
  const [articlesCount, setArticlesCount] = useState(1);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);

  // Mock gallery images (in real app, parse from content)
  const galleryImages = [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800",
  ];

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          articlesCount < Math.min(5, relatedArticles.length)
        ) {
          setArticlesCount((prev) => prev + 1);
          setLoadedArticles(relatedArticles.slice(0, articlesCount + 1));
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [articlesCount, relatedArticles]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = article?.title || "";

    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(text)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  };

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl text-gray-600 dark:text-gray-400">
          Article not found
        </h1>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={`${article.title} - Qahwa World`}
        description={article.excerpt}
        keywords={`coffee, ${article.category}, ${article.tags?.join(", ")}`}
        ogImage={article.image}
      />
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Breadcrumb - Hidden on Mobile */}
        <div className="hidden md:block bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link
                href={getPath(`/`)}
                className="hover:text-amber-700 dark:hover:text-amber-500"
              >
                {t.home}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <Link
                href={getPath(`/${encodeURIComponent(article.category)}`)}
                className="hover:text-amber-700 dark:hover:text-amber-500"
              >
                {getCategoryTranslation(article.category, language)}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-gray-100 line-clamp-1">
                {article.title}
              </span>
            </div>
          </div>
        </div>

        {/* Leaderboard Ad below Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border dark:border-gray-600 p-4">
              <div className="flex items-center justify-center h-24 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="block mb-1 text-xl">📰</span>
                  <span className="block">Leaderboard Advertisement</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    728x90
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
          <div className="max-w-4xl mx-auto">
            {/* Main Article */}
            <article className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm mb-8">
              {/* Featured Image - Reduced height on mobile */}
              <div className="w-full h-48 md:h-96 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 md:p-8">
                {/* Category Badge */}
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-4">
                  {article.category}
                </Badge>

                {/* Title - Reduced size on mobile */}
                <h1 className="text-3xl md:text-4xl mb-4 md:mb-6 text-amber-900 dark:text-amber-100">
                  {article.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-3 mb-8 pb-8 border-b dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Share:
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("facebook")}
                    className="gap-2"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("twitter")}
                    className="gap-2"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("linkedin")}
                    className="gap-2"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("copy")}
                    className="gap-2"
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none mb-8 text-gray-700 dark:text-gray-300">
                  <p>{article.excerpt}</p>
                  <p>
                    Coffee culture represents a rich tapestry of traditions,
                    innovations, and social connections that span across
                    continents and centuries. From the ancient coffee ceremonies
                    of Ethiopia to the modern specialty coffee movements in
                    urban centers worldwide, coffee has always been more than
                    just a beverage—it's a catalyst for conversation,
                    creativity, and community.
                  </p>
                  <p>
                    Coffee culture represents a rich tapestry of traditions,
                    innovations, and social connections that span across
                    continents and centuries. From the ancient coffee ceremonies
                    of Ethiopia to the modern specialty coffee movements in
                    urban centers worldwide, coffee has always been more than
                    just a beverage—it's a catalyst for conversation,
                    creativity, and community.
                  </p>

                  {/* Gallery Section */}
                  <div className="my-8">
                    <h3 className="text-xl mb-4 text-amber-900 dark:text-amber-100">
                      Gallery
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {galleryImages.map((img, index) => (
                        <div
                          key={index}
                          className="aspect-video overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setGalleryOpen(true);
                          }}
                        >
                          <img
                            src={img}
                            alt={`Gallery image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <p>
                    The art of coffee brewing has evolved dramatically over the
                    years. Whether it's the precise pour-over technique, the
                    pressure-driven espresso extraction, or the immersive cold
                    brew process, each method brings out unique flavors and
                    characteristics from the coffee beans. Understanding these
                    techniques not only enhances the taste experience but also
                    deepens our appreciation for the craft behind every cup.
                  </p>
                  <p>
                    As we look to the future, sustainability and ethical
                    sourcing have become paramount in the coffee industry. From
                    direct trade relationships with farmers to eco-friendly
                    packaging solutions, the coffee community is increasingly
                    focused on creating a positive impact at every stage of the
                    supply chain.
                  </p>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="pt-8 border-t dark:border-gray-700">
                    <h3 className="text-lg mb-4 text-gray-900 dark:text-gray-100">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <Link
                          key={index}
                          href={getPath(`/tag/${encodeURIComponent(tag)}`)}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-amber-100 dark:hover:bg-amber-900 text-gray-700 dark:text-gray-300 hover:text-amber-900 dark:hover:text-amber-100 text-sm transition-colors"
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Author Box */}
                <Link
                  href={getPath(`/author/1`)}
                  className="block w-full"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 p-4 md:p-8 rounded-lg mb-8 shadow-md hover:shadow-lg transition-all group mt-8">
                    <div className="flex items-start gap-3 md:gap-6">
                      <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-[#c90000] to-[#a00000] rounded-full flex items-center justify-center text-white text-xl md:text-3xl shrink-0 shadow-lg">
                        {article.author.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg md:text-xl group-hover:text-[#c90000] transition-colors">
                            {article.author}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {language === "ar"
                              ? "كاتب"
                              : language === "ru"
                                ? "Писатель"
                                : "Writer"}
                          </Badge>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2 md:mb-3">
                          {language === "ar"
                            ? `صحفي متخصص في ${getCategoryTranslation(
                              article.category,
                              "ar"
                            )}، يمتلك خبرة واسعة في تغطية الأحداث والتطورات في هذا المجال.`
                            : language === "ru"
                              ? `Журналист, специализирующийся на ${getCategoryTranslation(
                                article.category,
                                "ru"
                              )}, с обширным опытом освещения событий и развития в этой области.`
                              : `A journalist specializing in ${article.category}, with extensive experience covering events and developments in this field.`}
                        </p>
                        <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {language === "ar"
                              ? "45 مقالاً"
                              : language === "ru"
                                ? "45 статей"
                                : "45 articles"}
                          </span>
                          <span>•</span>
                          <span className="text-[#c90000] group-hover:underline">
                            {language === "ar"
                              ? "عرض المقالات ←"
                              : language === "ru"
                                ? "Просмотреть статьи ←"
                                : "View Articles ←"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </article>

            {/* Related Articles - Load on Scroll */}
            {loadedArticles.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-2xl text-amber-900 dark:text-amber-100 border-b dark:border-gray-700 pb-4">
                  Related Articles
                </h2>

                {loadedArticles.map((relArticle, index) => (
                  <React.Fragment key={relArticle.id}>
                    <Link
                      href={getPath(`/article/${relArticle.id}`)}
                      className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer block"
                    >
                      <div className="flex flex-col md:flex-row md:grid md:grid-cols-3 gap-0">
                        <div className="md:col-span-1 h-64">
                          <img
                            src={relArticle.image}
                            alt={relArticle.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="md:col-span-2 p-6">
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-3">
                            {relArticle.category}
                          </Badge>
                          <h3 className="text-2xl mb-3 text-amber-900 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-500 transition-colors">
                            {relArticle.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {relArticle.excerpt}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{relArticle.date}</span>
                            <span>•</span>
                            <span>{relArticle.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            {articlesCount < Math.min(5, relatedArticles.length) && (
              <div ref={observerRef} className="py-8 text-center">
                <div className="inline-block animate-pulse text-amber-700">
                  Loading more articles...
                </div>
              </div>
            )}

            {/* End Message */}
            {articlesCount >= Math.min(5, relatedArticles.length) &&
              relatedArticles.length > 0 && (
                <div className="py-8 text-center text-gray-500">
                  <p>You've reached the end of related articles</p>
                  <Link href={getPath(`/${encodeURIComponent(article.category)}`)}>
                    <Button className="mt-4 bg-amber-700 hover:bg-amber-800">
                      View All {article.category} Articles
                    </Button>
                  </Link>
                </div>
              )}
          </div>
        </div>

        {/* Gallery Modal */}
        {galleryOpen && (
          <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-4 right-4 p-2 text-white hover:text-amber-400 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <div className="max-w-5xl w-full">
              <img
                src={galleryImages[selectedImageIndex]}
                alt={`Gallery image ${selectedImageIndex + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev > 0 ? prev - 1 : galleryImages.length - 1
                    )
                  }
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Previous
                </button>
                <span className="text-white">
                  {selectedImageIndex + 1} / {galleryImages.length}
                </span>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev < galleryImages.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Next
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2 mt-6">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-video overflow-hidden transition-opacity ${index === selectedImageIndex
                      ? "ring-2 ring-amber-500"
                      : "opacity-60 hover:opacity-100"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export { ArticleDetailPage };
