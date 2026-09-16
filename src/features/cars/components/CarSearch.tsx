import { IconButton, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { ChangeEvent } from "react";

export interface CarSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CarSearch = ({
  value,
  onChange,
  placeholder = "Filter by model (e.g. Q5, A3, R8)...",
  disabled = false,
}: CarSearchProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      inputProps={{
        "aria-label": "Search cars by model",
        "data-testid": "car-search-input",
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon color="action" fontSize="small" />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              aria-label="Clear search"
              onClick={handleClear}
              edge="end"
              data-testid="car-search-clear"
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};
