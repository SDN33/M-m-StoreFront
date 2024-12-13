type Params = Promise<{ id: string }>;

export default async function Layout(props: { 
  children: React.ReactNode;
  params: Params;
}) {
  const { id } = await props.params;
  return <>{props.children}</>;
}