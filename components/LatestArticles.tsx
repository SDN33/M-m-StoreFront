import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Clock, ArrowRight, Rss } from "lucide-react";
import he from "he";
import Link from "next/link";
import { CommentCount } from 'disqus-react';

// Simple date formatting function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

type Article = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage: string | null;
  date: string;
  author?: string;
  readTime?: number;
};

const LatestArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/articles");
        const data = await response.json();

        if (data.success) {
          setArticles(data.articles.slice(0, 4));
        } else {
          setError("Impossible de récupérer les articles.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des articles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8 sm:mb-8 lg:mb-0">
      <div className="text-center mb-10 bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 pt-7 rounded-t-xl">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-extrabold text-primary text-center">
          <span className="text-white">Le Blog de </span><br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="flex sm:flex md:hidden lg:hidden xl:hidden -mt-8 "></span><span className="sm:flex md:hidden lg:hidden">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>Mémé Georgette&nbsp;
          <Rss size={32} className="inline text-white animate-ping duration-1000" />
        </h2>
        <p className="text-sm md:text-xl lg:text-xl  font-extrabold slide-in-right max-w-2xl mx-auto mb-8 text-white">
          Découvrez nos derniers articles du monde du vin
        </p>
        <div className="border-b-4 border-white w-full max-w-[50rem] my-2 slide-in-right mx-auto"></div>
      </div>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          >
            <div className="relative h-48 overflow-hidden rounded-t-xl">
              <a href={`/blog/${article.id}`}>
                <Image
                  src={article.featuredImage || "/default-image.jpg"}
                  alt={article.title}
                  fill
                  className="absolute inset-0 w-full h-full object-cover cursor-pointer"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </a>
            </div>

            <div className="p-5">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <Clock size={16} className="mr-2" />
                <span>
                  {formatDate(article.date)}
                  {article.readTime && ` · ${article.readTime} min lecture`}
                </span>
              </div>

              <h3 className="font-bold text-xl text-gray-950 mb-3 line-clamp-2">
                {he.decode((article.title || "").replace(/<\/?[^>]+(>|$)/g, ""))}
              </h3>

              <div
                className="text-gray-600 mb-4 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />

              <div className="flex items-center justify-between">
                <a
                  href={`/blog/${article.id}`}
                  className="text-primary hover:text-primary-dark font-semibold flex items-center group"
                >
                  Lire la suite
                  <ArrowRight
                    size={20}
                    className="ml-2 transform transition-transform group-hover:translate-x-1"
                  />
                </a>
                <span className="text-right ml-8 text-xs text-primary font-semibold">
                  <CommentCount
                      shortname='vinsmemegeorgette'
                      config={
                          {
                            url: `https://vinsmemegeorgette.com/blog/${article.id}`,
                            identifier: article.id.toString(),
                            title: `Post ${article.id}`,
                          }
                      }
                  >
                      {/* Placeholder Text */}
                  </CommentCount>
                </span>
              </div>
            </div>
          </div>
        ))}
        <Link
            href={`/blog`}
            className="inline-flex items-center text-sm px-2 py-2 bg-blue-50 text-primary rounded-lg hover:bg-blue-100 transition-colors duration-200"
          >
            Voir tous nos articles →
          </Link>
      </div>
    </div>
  );
};

export default LatestArticles;
