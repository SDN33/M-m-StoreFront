import { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/api/articles`, {
      next: { revalidate: 3600 }
    });

    const data = await response.json();
    const article = data.articles?.find((a: any) => a.id === parseInt(params.id, 10));

    if (!article) {
      return {
        title: "Article non trouvé | Le Blog de VinsMemeGeorgette.com"
      };
    }

    return {
      title: `${article.title} | Le Blog de VinsMemeGeorgette.com`
    };
  } catch (error) {
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
