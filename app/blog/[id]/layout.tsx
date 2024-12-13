import { generateMetadata } from './metadata';

export { generateMetadata };

interface BlogLayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export default async function BlogLayout({
  children,
  params,
}: BlogLayoutProps) {
  return <>{children}</>;
}
