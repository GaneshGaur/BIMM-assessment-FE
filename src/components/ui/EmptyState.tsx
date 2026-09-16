import { Box, Button, Typography, type SxProps, type Theme } from "@mui/material";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import type { ReactNode } from "react";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  sx?: SxProps<Theme>;
}

export const EmptyState = ({
  title = "No items found",
  description = "Try adjusting your filters or search terms.",
  icon,
  actionLabel,
  onAction,
  sx,
}: EmptyStateProps) => {
  return (
    <Box
      data-testid="empty-state"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 3,
        textAlign: "center",
        borderRadius: 2,
        border: "1px dashed",
        borderColor: "divider",
        backgroundColor: "background.paper",
        ...sx,
      }}
    >
      <Box sx={{ color: "text.secondary", mb: 2 }}>
        {icon ?? <DirectionsCarOutlinedIcon sx={{ fontSize: 56, color: "text.disabled" }} />}
      </Box>
      <Typography variant="h6" component="h3" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mb: actionLabel ? 3 : 0 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="outlined" size="small" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
