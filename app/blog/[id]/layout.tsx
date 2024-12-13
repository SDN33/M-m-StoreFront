import { generateMetadata } from './metadata';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    id: string;
  };
}

export { generateMetadata };

export default function BlogLayout({
  children,
  params,
}: LayoutProps) {
  return <>{children}</>;
}
