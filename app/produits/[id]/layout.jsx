export { generateMetadata } from './metadata';

export async function generateStaticParams() {
  // Return an array of objects with the expected params structure
  const { getAllProductIds } = await import('./metadata');
  const productIds = await getAllProductIds();
  return productIds.map(id => ({ params: { id: id.toString() } }));
}

export default function ProductLayout({ children }) {
  return <>{children}</>;
}
