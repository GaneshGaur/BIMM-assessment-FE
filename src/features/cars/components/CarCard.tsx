import { Card, CardContent, Chip, Stack, Typography, Box } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { Car } from "../types";

interface Props {
  car: Car;
}

export const CarCard = ({ car }: Props) => {
  const title = `${car.make} ${car.model}`;

  return (
    <Card
      component="article"
      data-testid={`car-card-${car.id}`}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <Box sx={{ position: "relative", width: "100%", paddingTop: "56.25%", bgcolor: "grey.100" }}>
        <Box
          component="picture"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "block",
            "& img": { width: "100%", height: "100%", objectFit: "cover" },
          }}
        >
          <source media="(min-width: 1024px)" srcSet={car.desktop} data-testid="car-image-desktop" />
          <source media="(min-width: 640px)" srcSet={car.tablet} data-testid="car-image-tablet" />
          <img
            src={car.mobile}
            alt={`${title} (${car.year}) in ${car.color}`}
            loading="lazy"
            data-testid="car-image-mobile"
          />
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={700} noWrap>
            {title}
          </Typography>
          <Chip
            size="small"
            color="primary"
            icon={<CalendarTodayIcon sx={{ fontSize: "0.85rem !important" }} />}
            label={car.year}
          />
        </Stack>        
      </CardContent>
    </Card>
  );
};