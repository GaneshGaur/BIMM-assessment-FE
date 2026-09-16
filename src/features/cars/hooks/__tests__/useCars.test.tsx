import { renderHook, waitFor, act } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";
import { useCars } from "../useCars";
import { apolloClient } from "@/lib/apollo";
import { server } from "@/mocks/server";
import { db } from "@/mocks/db";
import { graphql, HttpResponse } from "msw";
import type { ReactNode } from "react";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  db.reset();
  apolloClient.clearStore();
});
afterAll(() => server.close());

const wrapper = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
);

describe("useCars hook", () => {
  it("fetches list of cars successfully", async () => {
    const { result } = renderHook(() => useCars(), { wrapper });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.cars).toHaveLength(6);
    expect(result.current.error).toBeUndefined();
  });

  it("handles fetch error when API fails", async () => {
    server.use(
      graphql.query("GetCars", () =>
        HttpResponse.json({ errors: [{ message: "Internal server error" }] })
      )
    );

    const { result } = renderHook(() => useCars(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.cars).toEqual([]);
  });

  it("creates a new car and reconciles data", async () => {
    const { result } = renderHook(() => useCars(), { wrapper });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const initialLength = result.current.cars.length;

    await act(async () => {
      await result.current.createCar({
        make: "Audi",
        model: "RS7",
        year: 2025,
        color: "Nardo Grey",
        mobile: "/images/r8-mobile.svg",
        tablet: "/images/r8-tablet.svg",
        desktop: "/images/r8-desktop.svg",
      });
    });

    await waitFor(() => {
      expect(result.current.cars.length).toBe(initialLength + 1);
      expect(result.current.cars.some((c) => c.model === "RS7")).toBe(true);
    });
  });
});
