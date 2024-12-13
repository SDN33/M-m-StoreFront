import { generateMetadata } from './metadata';
import { Metadata } from 'next';

export { generateMetadata };

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
