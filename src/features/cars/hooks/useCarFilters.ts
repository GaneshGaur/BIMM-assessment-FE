import { useState, useMemo, useEffect } from "react";
import type { Car, SortOptionValue } from "../types";

interface Options {
  debounceMs?: number;
}

export const useCarFilters = (cars: Car[], options: Options = {}) => {
  const { debounceMs = 200 } = options;

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [sort, setSort] = useState<SortOptionValue>("year-desc");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), debounceMs);
    return () => clearTimeout(timer);
  }, [search, debounceMs]);

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(cars.map((c) => c.year)));
    return years.sort((a, b) => b - a);
  }, [cars]);

  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.trim().toLowerCase();
          const matchModel = car.model.toLowerCase().includes(q);
          const matchMake = car.make.toLowerCase().includes(q);
          if (!matchModel && !matchMake) return false;
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
            return a.model.localeCompare(b.model);
          case "make-asc":
            return a.make.localeCompare(b.make);
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