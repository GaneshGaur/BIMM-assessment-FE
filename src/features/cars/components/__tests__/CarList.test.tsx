import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarList } from "../CarList";
import type { Car } from "../../types";

const mockCars: Car[] = [
  {
    id: "1",
    make: "Audi",
    model: "Q5",
    year: 2023,
    color: "Glacier White",
    mobile: "/images/q5-mobile.svg",
    tablet: "/images/q5-tablet.svg",
    desktop: "/images/q5-desktop.svg",
  },
  {
    id: "2",
    make: "Audi",
    model: "A3",
    year: 2022,
    color: "Tango Red",
    mobile: "/images/a3-mobile.svg",
    tablet: "/images/a3-tablet.svg",
    desktop: "/images/a3-desktop.svg",
  },
];

describe("CarList", () => {
  it("renders loading skeletons when loading is true", () => {
    render(<CarList cars={[]} loading={true} />);

    expect(screen.getByTestId("car-list-loading")).toBeInTheDocument();
    expect(screen.getAllByTestId("car-skeleton")).toHaveLength(6);
  });

  it("renders error alert with retry button when error is present", async () => {
    const user = userEvent.setup();
    const handleRetry = jest.fn();
    const mockError = new Error("Failed to connect to GraphQL endpoint");

    render(<CarList cars={[]} error={mockError} onRetry={handleRetry} />);

    expect(screen.getByTestId("car-list-error")).toBeInTheDocument();
    expect(screen.getByText("Failed to connect to GraphQL endpoint")).toBeInTheDocument();

    const retryBtn = screen.getByTestId("car-list-retry-button");
    await user.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledTimes(1);
  });

  it("renders empty state when no cars are found", () => {
    render(<CarList cars={[]} isFiltered={true} onResetFilters={jest.fn()} />);

    expect(screen.getByTestId("car-list-empty")).toBeInTheDocument();
    expect(screen.getByText("No matching vehicles found")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset Filters" })).toBeInTheDocument();
  });

  it("renders list of vehicle cards when cars are provided", () => {
    render(<CarList cars={mockCars} />);

    expect(screen.getByTestId("car-list")).toBeInTheDocument();
    expect(screen.getByTestId("car-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("car-card-2")).toBeInTheDocument();
    expect(screen.getByText("Audi Q5")).toBeInTheDocument();
    expect(screen.getByText("Audi A3")).toBeInTheDocument();
  });
});
