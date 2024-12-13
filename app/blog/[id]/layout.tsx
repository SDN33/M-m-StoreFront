import { generateMetadata } from './metadata';

export { generateMetadata };

type Props = {
  children: React.ReactNode;
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function BlogLayout(props: Props) {
  return props.children;
}
