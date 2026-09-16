import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import { CarCard } from "./CarCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Car } from "../types";

export interface CarListProps {
  cars: Car[];
  loading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

const SKELETON_COUNT = 6;

const CarSkeleton = () => (
  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }} data-testid="car-skeleton">
    <Skeleton variant="rectangular" sx={{ width: "100%", paddingTop: "56.25%" }} />
    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Skeleton variant="text" width="60%" height={32} />
        <Skeleton variant="rounded" width={54} height={24} />
      </Stack>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Skeleton variant="rounded" width={60} height={24} />
        <Skeleton variant="rounded" width={80} height={24} />
      </Stack>
    </CardContent>
  </Card>
);

export const CarList = ({
  cars,
  loading = false,
  error = null,
  onRetry,
  onResetFilters,
  isFiltered = false,
}: CarListProps) => {
  if (loading) {
    return (
      <Grid container spacing={3} data-testid="car-list-loading">
        {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`skeleton-${idx}`}>
            <CarSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }} data-testid="car-list-error">
        <Alert
          severity="error"
          action={
            onRetry ? (
              <Button
                color="inherit"
                size="small"
                startIcon={<ReplayIcon />}
                onClick={onRetry}
                data-testid="car-list-retry-button"
              >
                Retry
              </Button>
            ) : undefined
          }
        >
          <AlertTitle>Failed to load vehicle inventory</AlertTitle>
          {error.message || "An unexpected error occurred while fetching cars."}
        </Alert>
      </Box>
    );
  }

  if (cars.length === 0) {
    return (
      <Box sx={{ py: 2 }} data-testid="car-list-empty">
        <EmptyState
          title={isFiltered ? "No matching vehicles found" : "No vehicles in inventory"}
          description={
            isFiltered
              ? "We couldn't find any vehicles matching your current search or filter criteria."
              : "There are currently no vehicles listed in the system."
          }
          actionLabel={isFiltered ? "Reset Filters" : undefined}
          onAction={isFiltered ? onResetFilters : undefined}
        />
      </Box>
    );
  }

  return (
    <Grid container spacing={3} data-testid="car-list" component="section" aria-label="Vehicle Inventory List">
      {cars.map((car) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={car.id}>
          <CarCard car={car} />
        </Grid>
      ))}
    </Grid>
  );
};
