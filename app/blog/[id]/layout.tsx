import { Metadata } from 'next';

interface Article {
  id: number;
  title: string;
}

export async function generateMetadata({
  params,
}: {
  params: { id: number };
}): Promise<Metadata> {
  try {
    const response = await fetch(`/api/articles/${params.id}`, {
      next: { revalidate: 3600 }
    });

    const data = await response.json();
    const article = data.articles?.find((a: Article) => a.id === parseInt(params.id.toString(), 10));

    if (!article) {
      return {
        title: "Article non trouvé | Le Blog de VinsMemeGeorgette.com"
      };
    }

    return {
      title: `${article.title} | Le Blog de VinsMemeGeorgette.com`
    };
  } catch {
    return {
      title: "Le Blog de VinsMemeGeorgette.com"
    };
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
