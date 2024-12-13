import { generateMetadata } from './metadata';

export { generateMetadata };

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default function BlogLayout({
  children,
}: BlogLayoutProps) {
  return <>{children}</>;
}
