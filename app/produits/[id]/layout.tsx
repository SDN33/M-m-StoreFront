export { generateMetadata } from './metadata';
import { getAllProductIds } from './metadata';

export async function generateStaticParams() {
  // Return an array of objects with the expected params structure
  const productIds = await getAllProductIds();
  return productIds.map((id: string) => ({ params: { id } }));
}

import { ReactNode } from 'react';

export default function ProductLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
