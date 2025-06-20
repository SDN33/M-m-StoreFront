"use client";
import React, { useState, useEffect } from "react";
import { Clock, ArrowRight, Rss } from "lucide-react";
import he from "he";
import { CommentCount } from 'disqus-react';
import Slogan from "@/components/Slogan";
import Image from "next/image";


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

const Blog = () => {
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
            setArticles(data.articles.slice(0, 20));
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-opacity-75"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border  border-red-200 text-red-800 px-4 py-3 rounded relative mt-32 pb-60" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 lg:px-32 py-8 mb-20 mt-40">
      <div className='text-center text-xs mx-auto text-gray-950 mb-4'><a href="/">Accueil</a> / <strong>Blog de Mémé</strong></div>
      <div className="text-center mb-10 bg-gradient-to-r from-gray-950 via-gray-800 to-gray-950 pt-7 rounded-t-xl">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-primary">
        Le Blog de Mémé Georgette&nbsp;
        <Rss size={32} className="inline text-white animate-ping duration-1000" />
      </h1>
      <p className="text-sm md:text-xl lg:text-xl  font-extrabold slide-in-right max-w-2xl mx-auto mb-8 text-white">
        Découvrez tous nos derniers articles et actualités sur le vin et la vigne.
      </p>
      <div className="border-b-4 border-white w-full max-w-[50rem] my-2 slide-in-right mx-auto"></div>
      </div>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {articles.map((article) => (
        <div
        key={article.id}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        >
        <div className="relative h-48 overflow-hidden rounded-t-xl">
          <Image
          src={article.featuredImage || "/default-image.jpg"}
          alt={article.title}
          fill
          className="absolute inset-0 w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="p-5">
          <div className="flex items-center text-sm text-gray-500 mb-2">
          <Clock size={16} className="mr-2" />
          <span>
            {formatDate(article.date)}
            {article.readTime && ` · ${article.readTime} min lecture`}
          </span>
          </div>

          <a className="font-bold text-xl text-gray-950 mb-3 line-clamp-2" href={`/blog/${article.id}`}>
          {he.decode((article.title || "").replace(/<\/?[^>]+(>|$)/g, ""))}
          </a>

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
            <span className="text-right ml-8 text-xs">
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
          </a>
          </div>
        </div>
        </div>
      ))}
      </div>
      <div className="text-center mt-16 text-lg mb-16">
      <p>
        Un grand merci à nos contributeurs pour leur aide précieuse dans la rédaction de ces articles.
      </p>
      <p>
        Si vous souhaitez contribuer à notre blog, n&apos;hésitez pas à nous <a className="cursor-pointer text-primary" href="/contact">contacter</a>
      </p>
      </div>
      <Slogan />
    </div>
  );
};

export default Blog;
