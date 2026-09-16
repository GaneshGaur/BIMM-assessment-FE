import {
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Box,
} from "@mui/material";

import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { Car } from "../types";

export interface CarCardProps {
  car: Car;
}

export const CarCard = ({ car }: CarCardProps) => {
  const title = `${car.make} ${car.model}`;

  return (
    <Card
      component="article"
      data-testid={`car-card-${car.id}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "56.25%", // 16:9 Aspect Ratio
          overflow: "hidden",
          backgroundColor: "grey.100",
        }}
      >
        <Box
          component="picture"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            },
          }}
        >
          {/* Desktop breakpoint: >= 1024px */}
          <source
            media="(min-width: 1024px)"
            srcSet={car.desktop}
            data-testid="car-image-desktop"
          />
          {/* Tablet breakpoint: 640px - 1023px */}
          <source
            media="(min-width: 640px)"
            srcSet={car.tablet}
            data-testid="car-image-tablet"
          />
          {/* Mobile fallback: <= 639px */}
          <img
            src={car.mobile}
            alt={`${title} (${car.year}) in ${car.color}`}
            loading="lazy"
            data-testid="car-image-mobile"
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Typography variant="h6" component="h3" fontWeight={700} noWrap>
            {title}
          </Typography>
          <Chip
            size="small"
            color="primary"
            variant="filled"
            icon={<CalendarTodayIcon sx={{ fontSize: "0.85rem !important" }} />}
            label={car.year}
            sx={{ fontWeight: 600 }}
          />
        </Stack>

        
      </CardContent>
    </Card>
  );
};
