import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import type { ReactNode } from 'react';
const client = new ApolloClient({
    uri: import.meta.env.VITE_GRAPHQL_API_URL,
    cache: new InMemoryCache(),
});
export function ApolloProviderWrapper({ children }: { children: ReactNode }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}