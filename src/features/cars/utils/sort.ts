import type { SortOption } from "../types";

export const SORT_OPTIONS: SortOption[] = [
  { value: "year-desc", label: "Year: Newest to Oldest", field: "year", direction: "desc" },
  { value: "year-asc", label: "Year: Oldest to Newest", field: "year", direction: "asc" }  
];
