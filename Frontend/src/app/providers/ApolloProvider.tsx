import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import type { ReactNode } from 'react';
const client = new ApolloClient({
    uri: "http://localhost:5050/graphql",
    cache: new InMemoryCache(),
});
export function ApolloProviderWrapper({ children }: { children: ReactNode }) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}