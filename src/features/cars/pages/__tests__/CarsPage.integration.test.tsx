import { renderWithProviders, createApolloClient, screen, waitFor } from "@/test/renderWithProviders";
import userEvent from "@testing-library/user-event";
import { CarsPage } from "../CarsPage";
import { server } from "@/mocks/server";
import { db } from "@/mocks/db";
import { graphql, HttpResponse } from "msw";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  db.reset();
});
afterEach(() => {
  server.resetHandlers();
  db.reset();
});
afterAll(() => server.close());

describe("CarsPage integration", () => {
  it("loads and displays the initial car inventory with count", async () => {
    const client = createApolloClient();
    renderWithProviders(<CarsPage />, { client });

    // Initially shows loading skeleton
    expect(screen.getByTestId("car-list-loading")).toBeInTheDocument();

    // Resolves and displays 6 cars
    await waitFor(() => {
      expect(screen.getByTestId("car-list")).toBeInTheDocument();
    });

    expect(screen.getByText("Audi Q5")).toBeInTheDocument();
    expect(screen.getByText("Audi A3")).toBeInTheDocument();
    expect(screen.getByText("Audi R8")).toBeInTheDocument();
    expect(screen.getByTestId("inventory-count")).toHaveTextContent("Showing 6 of 6 vehicles");
  });

  it("filters cars by search query and shows matching subset", async () => {
    const user = userEvent.setup();
    const client = createApolloClient();
    renderWithProviders(<CarsPage />, { client });

    await waitFor(() => {
      expect(screen.getByTestId("car-list")).toBeInTheDocument();
    });

    const searchInput = screen.getByRole("textbox", { name: "Search cars by model" });
    await user.type(searchInput, "R8");

    await waitFor(() => {
      expect(screen.getByText("Audi R8")).toBeInTheDocument();
      expect(screen.queryByText("Audi A3")).not.toBeInTheDocument();
      expect(screen.getByTestId("inventory-count")).toHaveTextContent("Showing 1 of 6 vehicles");
    });
  });

  it("opens create car form, creates a new car, and renders it in the list", async () => {
    const user = userEvent.setup();
    const client = createApolloClient();
    renderWithProviders(<CarsPage />, { client });

    await waitFor(() => {
      expect(screen.getByTestId("car-list")).toBeInTheDocument();
    });

    const addBtn = screen.getByTestId("add-car-button");
    await user.click(addBtn);

    expect(await screen.findByRole("heading", { name: "Add New Vehicle" })).toBeInTheDocument();

    await user.type(screen.getByTestId("create-car-make-input"), "Audi");
    await user.type(screen.getByTestId("create-car-model-input"), "RS3 Sportback");
    await user.clear(screen.getByTestId("create-car-year-input"));
    await user.type(screen.getByTestId("create-car-year-input"), "2024");
    await user.type(screen.getByTestId("create-car-color-input"), "Kyalami Green");

    const submitBtn = screen.getByTestId("create-car-submit-button");
    await user.click(submitBtn);

    // Verify snackbar notification
    await waitFor(() => {
      expect(screen.getByTestId("car-snackbar-alert")).toBeInTheDocument();
      expect(screen.getByText(/Successfully added 2024 Audi RS3 Sportback/i)).toBeInTheDocument();
    });

    // Verify new car is rendered in inventory list
    expect(await screen.findByText("Audi RS3 Sportback")).toBeInTheDocument();
    expect(screen.getByTestId("inventory-count")).toHaveTextContent("Showing 7 of 7 vehicles");
  });

  it("displays error state when GraphQL API fails and allows retrying", async () => {
    const user = userEvent.setup();

    server.use(
      graphql.query("GetCars", () =>
        HttpResponse.json({ errors: [{ message: "Failed to fetch vehicle inventory" }] })
      )
    );

    const client = createApolloClient();
    renderWithProviders(<CarsPage />, { client });

    await waitFor(() => {
      expect(screen.getByTestId("car-list-error")).toBeInTheDocument();
    });

    expect(screen.getByText(/Failed to fetch vehicle inventory/i)).toBeInTheDocument();

    // Now reset handler to normal and click retry
    server.resetHandlers();
    const retryButton = screen.getByTestId("car-list-retry-button");
    await user.click(retryButton);

    await waitFor(() => {
      expect(screen.getByTestId("car-list")).toBeInTheDocument();
      expect(screen.getByText("Audi Q5")).toBeInTheDocument();
    });
  });
});
