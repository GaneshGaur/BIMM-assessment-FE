import { useState, useMemo, useEffect } from "react";
import type { Car, SortOptionValue } from "../types";

export interface UseCarFiltersOptions {
  initialSearch?: string;
  initialYear?: number | "";
  initialSort?: SortOptionValue;
  debounceMs?: number;
}

export const useCarFilters = (
  cars: Car[],
  options: UseCarFiltersOptions = {}
) => {
  const {
    initialSearch = "",
    initialYear = "",
    initialSort = "year-desc",
    debounceMs = 200,
  } = options;

  const [search, setSearch] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);
  const [year, setYear] = useState<number | "">(initialYear);
  const [sort, setSort] = useState<SortOptionValue>(initialSort);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [search, debounceMs]);


  const availableYears = useMemo(() => {
    const years = Array.from(new Set(cars.map((c) => c.year)));
    return years.sort((a, b) => b - a);
  }, [cars]);


  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        // Model search filter (case-insensitive substring)
        if (debouncedSearch.trim()) {
          const term = debouncedSearch.trim().toLowerCase();
          const matchesModel = car.model.toLowerCase().includes(term);
          const matchesMake = car.make.toLowerCase().includes(term);
          if (!matchesModel && !matchesMake) return false;
        }

       
        if (year !== "" && car.year !== Number(year)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sort) {
          case "year-desc":
            return b.year - a.year;
          case "year-asc":
            return a.year - b.year;
          case "model-asc":
            return a.model.localeCompare(b.model);
          case "model-desc":
            return b.model.localeCompare(a.model);
          case "make-asc":
            return a.make.localeCompare(b.make);
          case "make-desc":
            return b.make.localeCompare(a.make);
          default:
            return 0;
        }
      });
  }, [cars, debouncedSearch, year, sort]);

  const isFiltered = search.trim() !== "" || year !== "";

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setYear("");
    setSort("year-desc");
  };

  return {
    search,
    setSearch,
    debouncedSearch,
    year,
    setYear,
    sort,
    setSort,
    availableYears,
    filteredCars,
    isFiltered,
    resetFilters,
  };
};
