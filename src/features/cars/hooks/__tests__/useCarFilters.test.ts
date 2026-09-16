import { renderHook, act } from "@testing-library/react";
import { useCarFilters } from "../useCarFilters";
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
  {
    id: "3",
    make: "Audi",
    model: "R8",
    year: 2024,
    color: "Nardo Grey",
    mobile: "/images/r8-mobile.svg",
    tablet: "/images/r8-tablet.svg",
    desktop: "/images/r8-desktop.svg",
  },
];

describe("useCarFilters", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with default values and sorts by year descending", () => {
    const { result } = renderHook(() => useCarFilters(mockCars));

    expect(result.current.search).toBe("");
    expect(result.current.year).toBe("");
    expect(result.current.sort).toBe("year-desc");
    expect(result.current.filteredCars[0].model).toBe("R8"); // 2024
    expect(result.current.filteredCars[1].model).toBe("Q5"); // 2023
    expect(result.current.filteredCars[2].model).toBe("A3"); // 2022
    expect(result.current.availableYears).toEqual([2024, 2023, 2022]);
  });

  it("filters cars by search term after debounce delay", () => {
    const { result } = renderHook(() => useCarFilters(mockCars, { debounceMs: 100 }));

    act(() => {
      result.current.setSearch("Q5");
    });

    expect(result.current.search).toBe("Q5");

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.debouncedSearch).toBe("Q5");
    expect(result.current.filteredCars).toHaveLength(1);
    expect(result.current.filteredCars[0].model).toBe("Q5");
  });

  it("filters cars by year", () => {
    const { result } = renderHook(() => useCarFilters(mockCars));

    act(() => {
      result.current.setYear(2022);
    });

    expect(result.current.filteredCars).toHaveLength(1);
    expect(result.current.filteredCars[0].model).toBe("A3");
  });

  it("sorts cars by model A-Z", () => {
    const { result } = renderHook(() => useCarFilters(mockCars));

    act(() => {
      result.current.setSort("model-asc");
    });

    expect(result.current.filteredCars.map((c) => c.model)).toEqual(["A3", "Q5", "R8"]);
  });

  it("resets filters when resetFilters is called", () => {
    const { result } = renderHook(() => useCarFilters(mockCars));

    act(() => {
      result.current.setSearch("R8");
      result.current.setYear(2024);
      result.current.setSort("model-desc");
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.search).toBe("");
    expect(result.current.year).toBe("");
    expect(result.current.sort).toBe("year-desc");
  });
});
