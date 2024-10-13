// apollo-client.js
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, // Utilisez une variable d'environnement
  cache: new InMemoryCache(),
});

export default client;
