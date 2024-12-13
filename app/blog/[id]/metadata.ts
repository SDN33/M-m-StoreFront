import { Metadata, ResolvingMetadata } from "next";
import he from "he";

interface Article {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  featuredImage: string | null;
  date: string;
  author?: string;
  readTime?: number;
  categories?: Array<{
    id: number;
    name: string;
  }>;
}

const filterTags = (content: string): string[] => {
  const stopWords = ["d&rsquo;honneur,mais", "je", "les", "le", "ou", "il", "la", "et", "à", "de", "du", "au", "des", "en", "?ah,", "un", "une", "ce", "cette", "cet", "ces", "qui", "que", "quoi", "où", "quand", "comment", "pourquoi"];
  const words = content
    .replace(/<\/?[^>]+(>|$)/g, "")
    .toLowerCase()
    .split(/\s+/);
  return [...new Set(words.filter(word => word.length > 3 && !stopWords.includes(word)).map(word => word.replace(/[.,]/g, '')))];
};

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/api/articles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch article data: ${response.statusText}`);
    }

    const data = await response.json();
    const article = data.articles?.find((a: Article) => a.id === parseInt(params.id, 10));

    if (!article) {
      return {
        title: "Article non trouvé | Le Blog de VinsMemeGeorgette.com",
        description: "L'article que vous recherchez n'a pas été trouvé.",
      };
    }

    const cleanTitle = he.decode(article.title.replace(/<\/?[^>]+(>|$)/g, ""));
    const cleanContent = article.content.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 200) + "...";
    const tags = filterTags(article.content);
    const title = `${cleanTitle} | Le Blog de VinsMemeGeorgette.com`;
    const description = cleanContent;

    return {
      title,
      description,
      authors: [{ name: article.author || "Charles @MéméGeorgette" }],
      openGraph: {
        title,
        description,
        images: [
          {
            url: article.featuredImage || '/images/vinmeme.png',
            width: 1200,
            height: 630,
            alt: cleanTitle
          }
        ],
        locale: "fr_FR",
        type: "article",
        siteName: "VinsMemeGeorgette.com",
        publishedTime: article.date,
        authors: [article.author || "Charles @MéméGeorgette"],
        tags: tags.slice(0, 8),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [article.featuredImage || '/images/vinmeme.png'],
        creator: "@MemeGeorgette",
      },
      alternates: {
        canonical: `https://vinsmemegeorgette.com/blog/${params.id}`
      },
      keywords: tags.slice(0, 10),
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        "article:published_time": article.date,
        "article:author": article.author || "Charles @MéméGeorgette",
        "article:section": "Blog",
        "article:tag": tags.slice(0, 8).join(","),
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Le Blog de VinsMemeGeorgette.com",
      description: "Découvrez nos articles sur le vin bio et biodynamique.",
    };
  }
}
