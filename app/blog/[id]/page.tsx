'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Clock, Facebook, Twitter, Linkedin, Link2 } from "lucide-react";
import he from "he";
import Comments from "@/components/Comments";

interface Article {
  id: number;
  title: string;
  content: string;
  slug: string;
  featuredImage: string | null;
  date: string;
  author?: string;
  readTime?: number;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const SocialShare = ({ title, url }: { title: string; url: string }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(url);
        alert('Lien copié !');
      } catch (err) {
        alert(`Erreur lors de la copie du lien: ${err}`);
      }
    };

    return (
      <div className="flex space-x-4">
        <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
        <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
        <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
        <button onClick={copyToClipboard}><Link2 size={20} /></button>
      </div>
    );
  };

const removeFeaturedImageFromContent = (content: string, featuredImage: string | null): string => {
  if (!featuredImage) return content;

  // Créer un DOM temporaire pour manipuler le contenu HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  // Fonction pour vérifier si une URL d'image correspond à l'image vedette
  const isMatchingImage = (src: string) => {
    const cleanSrc = src.split('?')[0]; // Enlever les paramètres d'URL
    const cleanFeatured = featuredImage.split('?')[0];
    return cleanSrc === cleanFeatured;
  };

  // Nettoyer les différents types de conteneurs d'images
  ['wp-block-gallery', 'wp-block-image'].forEach(className => {
    const elements = tempDiv.getElementsByClassName(className);
    Array.from(elements).forEach(element => {
      const images = element.getElementsByTagName('img');
      if (Array.from(images).some(img => isMatchingImage(img.getAttribute('src') || ''))) {
        element.remove();
      }
    });
  });

  // Nettoyer les colonnes vides
  ['wp-block-column', 'wp-block-columns'].forEach(className => {
    const elements = tempDiv.getElementsByClassName(className);
    Array.from(elements).forEach(element => {
      if (!element.textContent?.trim()) {
        element.remove();
      }
    });
  });

  return tempDiv.innerHTML;
};

const ArticleSkeleton = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 mt-36 animate-pulse">
    <div className="text-center mb-10">
      <div className="h-12 bg-gray-200 w-3/4 mx-auto mb-4 rounded" />
      <div className="h-6 bg-gray-200 w-48 mx-auto rounded" />
    </div>
    <div className="aspect-[16/9] bg-gray-200 w-full mb-10 rounded-xl" />
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 w-full rounded" />
      <div className="h-4 bg-gray-200 w-5/6 rounded" />
      <div className="h-4 bg-gray-200 w-4/6 rounded" />
    </div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="max-w-2xl mx-auto mt-32 p-6 bg-red-50 border border-red-200 rounded-lg">
    <div className="text-center">
      <h2 className="text-xl font-semibold text-red-600 mb-2">Erreur</h2>
      <p className="text-gray-700">{message}</p>
    </div>
  </div>
);

const FeaturedImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative w-full mb-10">
    <div className="aspect-[16/9] relative rounded-xl overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(min-width: 1280px) 1200px, (min-width: 1024px) 1024px, (min-width: 768px) 768px, 100vw"
        priority
        quality={95}
      />
    </div>
  </div>
);

const ArticlePage = () => {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const authToken = `Authorization: Bearer your-token-here`;  // Replace with actual token handling logic
  const id = params?.id;

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("ID introuvable.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/articles`);
        const data = await response.json();

        if (data.success && data.articles) {
          const foundArticle = data.articles.find(
            (article: Article) => article.id === parseInt(Array.isArray(id) ? id[0] : id)
          );

          if (foundArticle) {
            setArticle(foundArticle);
          } else {
            setError("Article non trouvé.");
          }
        } else {
          setError("Erreur de récupération des articles.");
        }
      } catch (err) {
        setError(`Erreur lors de la récupération de l'article: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (isLoading) return <ArticleSkeleton />;
  if (error || !article) return <ErrorDisplay message={error || "Une erreur est survenue."} />;

  return (
    <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 mt-40">
      <header className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 max-w-4xl mx-auto">
          {he.decode((article.title || "").replace(/<\/?[^>]+(>|$)/g, ""))}
        </h1>
        <div className="flex justify-center items-center text-sm text-gray-500">
          <Clock size={16} className="mr-2" />
          <time dateTime={article.date}>
            {formatDate(article.date)}
            {article.readTime && ` · ${article.readTime} min lecture`}
          </time>
          <p>{article.author && ` · ${article.author}`}</p>
        </div>
      </header>

      {article.featuredImage && (
        <FeaturedImage src={article.featuredImage} alt={article.title} />
      )}

      <div
        className="prose prose-lg max-w-3xl mx-auto"
        dangerouslySetInnerHTML={{
          __html: removeFeaturedImageFromContent(article.content, article.featuredImage)
        }}
      />
      <div className="mt-8 flex justify-center">
        <SocialShare title={article.title} url={window.location.href} />
      </div>
      <br /><br />
      <Comments postId={article.id} userToken={authToken} />
    </article>
  );
};

export default ArticlePage;
