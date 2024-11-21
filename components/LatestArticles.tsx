import React, { useEffect, useState } from "react";
import Image from "next/image";
import he from "he";

type Article = {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  featuredImage: string | null;
  date: string;
};

const LatestArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles");
        const data = await response.json();

        if (data.success) {
          // Ne garder que les 4 derniers articles
          setArticles(data.articles.slice(0, 4));
        } else {
          setError("Impossible de récupérer les articles.");
        }
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des articles.");
      }
    };

    fetchArticles();
  }, []);

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="my-8 mx-10">
      <h2 className="text-2xl font-bold text-center text-primary">Le Blog de Mémé Georgette</h2>
      <p className="text-center text-black mb-8">
        Retrouvez ici les derniers articles de notre blog.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {articles.map((article) => (
          <div key={article.id} className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src={article.featuredImage || "/default-image.jpg"}
                alt={article.title}
                width={500}
                height={160}
                className="w-full h-40 object-cover"
              />
              <h3 className="text-lg font-semibold mb-2">{he.decode((article.title || "").replace(/<\/?[^>]+(>|$)/g, ""))}</h3>
              <div
                className="text-sm text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: article.excerpt }}
              />
              <a
                href={`/blog/${article.slug}`}
                className="text-blue-500 hover:underline font-medium"
              >
                Lire la suite →
              </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestArticles;
