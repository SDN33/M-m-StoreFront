import { generateMetadata } from './metadata';

export { generateMetadata };

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default async function BlogLayout({
  children,
}: BlogLayoutProps) {
  return <>{children}</>;
}
