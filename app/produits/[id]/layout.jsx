export { generateMetadata } from './metadata';
import { getAllProductIds } from './metadata';

export async function generateStaticParams() {
  // Return an array of objects with the expected params structure
  const productIds = await getAllProductIds();
  return productIds.map(id => ({ params: { id } }));
}

export default function ProductLayout({ children }) {
  return <>{children}</>;
}
