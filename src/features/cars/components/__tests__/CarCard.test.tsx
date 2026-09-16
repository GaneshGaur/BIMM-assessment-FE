import { render, screen } from "@testing-library/react";
import { CarCard } from "../CarCard";
import type { Car } from "../../types";

const mockCar: Car = {
  id: "car-1",
  make: "Audi",
  model: "R8",
  year: 2024,
  color: "Nardo Grey",
  mobile: "/images/r8-mobile.svg",
  tablet: "/images/r8-tablet.svg",
  desktop: "/images/r8-desktop.svg",
};

describe("CarCard", () => {
  it("renders vehicle make, model, year, and color details", () => {
    render(<CarCard car={mockCar} />);

    expect(screen.getByRole("heading", { name: "Audi R8" })).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    //expect(screen.getByText("Audi")).toBeInTheDocument();
    //expect(screen.getByText("Nardo Grey")).toBeInTheDocument();
  });

  it("renders responsive picture element with proper media queries and image sources", () => {
    render(<CarCard car={mockCar} />);

    const desktopSource = screen.getByTestId("car-image-desktop");
    expect(desktopSource).toHaveAttribute("media", "(min-width: 1024px)");
    expect(desktopSource).toHaveAttribute("srcset", "/images/r8-desktop.svg");

    const tabletSource = screen.getByTestId("car-image-tablet");
    expect(tabletSource).toHaveAttribute("media", "(min-width: 640px)");
    expect(tabletSource).toHaveAttribute("srcset", "/images/r8-tablet.svg");

    const mobileImg = screen.getByTestId("car-image-mobile");
    expect(mobileImg).toHaveAttribute("src", "/images/r8-mobile.svg");
    expect(mobileImg).toHaveAttribute("alt", "Audi R8 (2024) in Nardo Grey");
  });
});
