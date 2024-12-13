'use client';
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import Image from "next/image";
import { Clock, Facebook, Twitter, Linkedin, Link2 } from "lucide-react";
import he from "he";
import dynamic from "next/dynamic";
import LatestArticles from "@/components/LatestArticles";
const Comments = dynamic(() => import("@/components/Comments"), { ssr: false });


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

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  const isMatchingImage = (src: string) => {
    const cleanSrc = src.split('?')[0];
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
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 mt-36">
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

const filterTags = (content: string): string[] => {
  const stopWords = ["nous,toujours,d&rsquo;honneur,mais", "je", "les", "le", "ou", "il", "la", "et", "à", "de", "du", "au", "des", "en", "?ah,", "un", "une", "ce", "cette", "cet", "ces", "qui", "que", "quoi", "où", "quand", "comment", "pourquoi", "est", "sont", "suis", "sommes", "êtes", "sont", "ai", "as", "a", "avons", "avez", "ont", "avais", "avait", "avions", "aviez", "avaient", "aurai", "auras", "aura", "aurons", "aurez", "auront", "aurais", "aurait", "aurions", "auriez", "auraient", "avais", "avait", "avions", "aviez", "avaient", "eut", "eûmes", "eûtes", "eurent", "aie", "aies", "ait", "ayons", "ayez", "aient", "eusse", "eusses", "eût", "eussions", "eussiez", "eussent", "fusse", "fusses", "fût", "fussions", "fussiez", "fussent", "ayant", "eu", "eue", "eues", "eus", "eûmes", "eûtes", "eurent", "ayant", "eu", "eue", "eues", "eus", "eûmes", "eûtes", "eurent", "ayant", "eu", "eue", "eues", "eus", "eûmes", "eûtes", "eurent", "ayant", "eu", "eue", "eues", "eus", "eûmes", "eûtes", "eurent", "ayant", "eu", "eue", "eues", "eus", "eûmes", "eûtes", "eurent", "ayant", "eu", "eue", "eues", "eus", "eûmes", "eûtes", "eurent", "ayant", "eu", "eue", "eues", "eus", "eûmes", "eûtes", "eurent", "ayant", "eu", "eue", "peut",  "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "pouvez", "pour", "par", "plus", "peu", "peut-être", "peuvent", "peux", "pouvons", "sembler"];
  const words = content
    .replace(/<\/?[^>]+(>|$)/g, "") // Retirer HTML
    .toLowerCase()
    .split(/\s+/);
  return [...new Set(words.filter(word => word.length > 3 && !stopWords.includes(word)).map(word => word.replace(/[.,]/g, '')))];
};

const ArticlePage = () => {
  const params = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const id = params?.id;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

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

  // Extraire les tags de l'article
  const tags = filterTags(article.content);

  return (
    <>
      <Head>
        <title>{article.title} | Le Blog de Mémé Georgette</title>
        <meta name="description" content={`Découvrez cet article : ${article.title}`} />
        <meta name="keywords" content={tags.join(", ")} />
        <meta name="author" content={"Charles @MéméGeorgette"} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={`Découvrez cet article : ${article.title}`} />
        <meta property="og:image" content={article.featuredImage || "/default-image.jpg"} />
        <meta property="og:url" content={currentUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 mt-44">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 mb-4 max-w-4xl mx-auto text-center">
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
          className="text-center prose prose-lg max-w-3xl mx-auto
            [&_h2]:text-4xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-8 [&_h2]:mb-4
            [&_a]:text-blue-600 [&_a]:underline [&_a]:hover:text-blue-800"
          dangerouslySetInnerHTML={{
            __html: removeFeaturedImageFromContent(article.content, article.featuredImage),
          }}
        />

        <div className="max-w-3xl mx-auto mt-10 text-center">
          <h2 className="text-xl font-bold mb-4">Tags de l&apos;article :</h2>
          <div className="flex flex-wrap gap-2 justify-center">
              {filterTags(article.content).slice(0, 8).map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 mb-18">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl font-bold mb-2">Partager cet article :</h2>
          </div>
          <div className="flex mx-auto justify-center">
            <SocialShare title={article.title} url={currentUrl} />
          </div>
        </div>

        <Comments postId={article.id} postTitle={article.title} postSlug={article.slug} />
        <br />
        <LatestArticles />
      </article>
    </>
  );
};

export default ArticlePage;
