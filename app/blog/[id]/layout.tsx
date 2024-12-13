import { generateMetadata } from './metadata';

export { generateMetadata };

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
