import { useState } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useCars } from "../hooks/useCars";
import { useCarFilters } from "../hooks/useCarFilters";
import { CarList } from "../components/CarList";
import { CarSearch } from "../components/CarSearch";
import { CarSort } from "../components/CarSort";
import { CreateCarForm } from "../components/CreateCarForm";
import type { CreateCarInput } from "../types";

export const CarsPage = () => {
  const { cars, loading, error, refetch, createCar, isCreating } = useCars();

  const {
    search,
    setSearch,
    year,
    setYear,
    sort,
    setSort,
    availableYears,
    filteredCars,
    isFiltered,
    resetFilters,
  } = useCarFilters(cars);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCreateCar = async (input: CreateCarInput) => {
    const created = await createCar(input);
    setSnackbar({
      open: true,
      message: `Successfully added ${created.year} ${created.make} ${created.model} to inventory!`,
      severity: "success",
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default", pb: 8 }}>
      {/* Top Application Header */}
      <AppBar position="static" color="inherit" elevation={1} sx={{ backgroundColor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1, gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
              data-testid="add-car-button"
            >
              Add Vehicle
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Controls Toolbar */}
        <Paper elevation={0} sx={{ p: 2.5, mb: 4, borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            {/* Search Input */}
            <Box sx={{ flex: 1, minWidth: { xs: "100%", md: 260 } }}>
              <CarSearch
                value={search}
                onChange={setSearch}
                disabled={loading}
              />
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
            >
              {/* Year Filter */}
              <FormControl size="small" sx={{ minWidth: 140, width: { xs: "100%", sm: "auto" } }} disabled={loading}>
                <InputLabel id="year-filter-label">Filter Year</InputLabel>
                <Select
                  labelId="year-filter-label"
                  id="year-filter-select"
                  value={year === "" ? "" : String(year)}
                  label="Filter Year"
                  onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
                  inputProps={{ "data-testid": "year-filter-select" }}
                  startAdornment={<CalendarMonthIcon sx={{ mr: 1, color: "action.active", fontSize: "1.1rem" }} />}
                >
                  <MenuItem value="">
                    <em>All Years</em>
                  </MenuItem>
                  {availableYears.map((yr) => (
                    <MenuItem key={yr} value={String(yr)}>
                      {yr}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Sort Dropdown */}
              <Box sx={{ width: { xs: "100%", sm: "auto" } }}>
                <CarSort
                  value={sort}
                  onChange={setSort}
                  disabled={loading}
                />
              </Box>

              {/* Reset Filters Action */}
              {isFiltered && (
                <Tooltip title="Reset all search and filter conditions">
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    startIcon={<FilterAltOffIcon />}
                    onClick={resetFilters}
                    data-testid="reset-filters-button"
                    sx={{ height: 40 }}
                  >
                    Reset
                  </Button>
                </Tooltip>
              )}
            </Stack>
          </Stack>

          {/* Result Count and Active Filters Summary */}
          {!loading && !error && (
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "grey.100", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
              <Typography variant="body2" color="text.secondary" data-testid="inventory-count">
                Showing <strong>{filteredCars.length}</strong> of <strong>{cars.length}</strong> vehicles
              </Typography>

              {isFiltered && (
                <Stack direction="row" spacing={1} alignItems="center">
                  {search && (
                    <Chip
                      size="small"
                      label={`Model: "${search}"`}
                      onDelete={() => setSearch("")}
                    />
                  )}
                  {year !== "" && (
                    <Chip
                      size="small"
                      label={`Year: ${year}`}
                      onDelete={() => setYear("")}
                    />
                  )}
                </Stack>
              )}
            </Box>
          )}
        </Paper>

        {/* Vehicle List */}
        <CarList
          cars={filteredCars}
          loading={loading}
          error={error}
          onRetry={() => refetch()}
          onResetFilters={resetFilters}
          isFiltered={isFiltered}
        />
      </Container>

      {/* Create Car Form Dialog */}
      <CreateCarForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateCar}
        isSubmitting={isCreating}
      />

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
          data-testid="car-snackbar-alert"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
