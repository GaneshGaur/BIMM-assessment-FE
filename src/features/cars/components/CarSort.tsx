import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import type { SortOptionValue } from "../types";
import { SORT_OPTIONS } from "../utils/sort";

export interface CarSortProps {
  value: SortOptionValue;
  onChange: (value: SortOptionValue) => void;
  disabled?: boolean;
}

export const CarSort = ({ value, onChange, disabled = false }: CarSortProps) => {
  const handleChange = (e: SelectChangeEvent<string>) => {
    onChange(e.target.value as SortOptionValue);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 200 }} disabled={disabled}>
      <InputLabel id="car-sort-label">Sort by</InputLabel>
      <Select
        labelId="car-sort-label"
        id="car-sort-select"
        value={value}
        label="Sort by"
        onChange={handleChange}
        inputProps={{
          "aria-label": "Sort cars",
          "data-testid": "car-sort-select",
        }}
        startAdornment={<SortIcon sx={{ mr: 1, color: "action.active", fontSize: "1.2rem" }} />}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
