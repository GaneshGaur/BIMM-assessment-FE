import { ApolloClient, ApolloProvider, type NormalizedCacheObject } from "@apollo/client";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactElement, ReactNode } from "react";
import { apolloClient, createApolloClient } from "@/lib/apollo";

/**
 * Renders a component inside the same providers the app uses.
 *
 * Pair this with `src/mocks/server.ts` when you want a test to exercise the
 * real Apollo client against the mock API. For unit tests of presentational
 * components, plain `render` from RTL is fine.
 */
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  client?: ApolloClient<NormalizedCacheObject>;
}

export const renderWithProviders = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const client = options?.client ?? apolloClient;

  const Providers = ({ children }: { children: ReactNode }) => (
    <ApolloProvider client={client}>
      <MemoryRouter>{children}</MemoryRouter>
    </ApolloProvider>
  );

  return render(ui, { wrapper: Providers, ...options });
};

export { createApolloClient };
export * from "@testing-library/react";
