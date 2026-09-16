import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import type { CreateCarInput } from "../types";

export interface CreateCarFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCarInput) => Promise<unknown>;
  isSubmitting?: boolean;
  serverError?: string | null;
}

interface FormState {
  make: string;
  model: string;
  year: number | string;
  color: string;
  mobile: string;
  tablet: string;
  desktop: string;
}

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  color?: string;
}

const currentYear = new Date().getFullYear();

const initialFormState: FormState = {
  make: "",
  model: "",
  year: currentYear,
  color: "",
  mobile: "",
  tablet: "",
  desktop: "",
};

export const CreateCarForm = ({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
  serverError = null,
}: CreateCarFormProps) => {
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleClose = () => {
    if (isSubmitting) return;
    setFormData(initialFormState);
    setErrors({});
    setSubmitError(null);
    onClose();
  };

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.make.trim()) {
      nextErrors.make = "Make is required";
    }

    if (!formData.model.trim()) {
      nextErrors.model = "Model is required";
    }

    const yearNum = Number(formData.year);
    if (!formData.year || Number.isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 2) {
      nextErrors.year = `Enter a valid year between 1900 and ${currentYear + 2}`;
    }

    if (!formData.color.trim()) {
      nextErrors.color = "Color is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    try {

      const slug = formData.model.toLowerCase().replace(/[^a-z0-9]/g, "") || "q5";
      const payload: CreateCarInput = {
        make: formData.make.trim(),
        model: formData.model.trim(),
        year: Number(formData.year),
        color: formData.color.trim(),
        mobile: formData.mobile.trim() || `/images/${slug}-mobile.svg`,
        tablet: formData.tablet.trim() || `/images/${slug}-tablet.svg`,
        desktop: formData.desktop.trim() || `/images/${slug}-desktop.svg`,
      };

      await onSubmit(payload);
      handleClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create car. Please check inputs.";
      setSubmitError(message);
    }
  };

  const displayError = serverError || submitError;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="create-car-dialog-title"
      data-testid="create-car-dialog"
    >
      <DialogTitle
        id="create-car-dialog-title"
        sx={{
          m: 0,
          p: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AddCircleOutlineIcon color="primary" />
          <Typography variant="h6" component="span" fontWeight={600}>
            Add New Vehicle
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={isSubmitting}
          size="small"
          data-testid="close-create-car-dialog"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent dividers sx={{ p: 3 }}>
          {displayError && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              data-testid="create-car-error"
            >
              {displayError}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="car-make"
                label="Make"
                placeholder="e.g. Audi"
                value={formData.make}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, make: e.target.value }));
                  if (errors.make) setErrors((prev) => ({ ...prev, make: undefined }));
                }}
                error={Boolean(errors.make)}
                helperText={errors.make}
                disabled={isSubmitting}
                inputProps={{ "data-testid": "create-car-make-input" }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="car-model"
                label="Model"
                placeholder="e.g. RS6 Avant"
                value={formData.model}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, model: e.target.value }));
                  if (errors.model) setErrors((prev) => ({ ...prev, model: undefined }));
                }}
                error={Boolean(errors.model)}
                helperText={errors.model}
                disabled={isSubmitting}
                inputProps={{ "data-testid": "create-car-model-input" }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="car-year"
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, year: e.target.value }));
                  if (errors.year) setErrors((prev) => ({ ...prev, year: undefined }));
                }}
                error={Boolean(errors.year)}
                helperText={errors.year}
                disabled={isSubmitting}
                inputProps={{
                  min: 1900,
                  max: currentYear + 2,
                  "data-testid": "create-car-year-input",
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                id="car-color"
                label="Color"
                placeholder="e.g. Daytona Grey"
                value={formData.color}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, color: e.target.value }));
                  if (errors.color) setErrors((prev) => ({ ...prev, color: undefined }));
                }}
                error={Boolean(errors.color)}
                helperText={errors.color}
                disabled={isSubmitting}
                inputProps={{ "data-testid": "create-car-color-input" }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
                Custom Image URLs (Optional — defaults to standard SVG badges)
              </Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                size="small"
                id="car-desktop-image"
                label="Desktop Image URL (≥1024px)"
                placeholder="/images/r8-desktop.svg"
                value={formData.desktop}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, desktop: e.target.value }))
                }
                disabled={isSubmitting}
                inputProps={{ "data-testid": "create-car-desktop-input" }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                id="car-tablet-image"
                label="Tablet Image URL (640-1023px)"
                placeholder="/images/r8-tablet.svg"
                value={formData.tablet}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tablet: e.target.value }))
                }
                disabled={isSubmitting}
                inputProps={{ "data-testid": "create-car-tablet-input" }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                id="car-mobile-image"
                label="Mobile Image URL (≤639px)"
                placeholder="/images/r8-mobile.svg"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                }
                disabled={isSubmitting}
                inputProps={{ "data-testid": "create-car-mobile-input" }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleClose}
            disabled={isSubmitting}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
            data-testid="create-car-submit-button"
          >
            {isSubmitting ? "Creating..." : "Create Vehicle"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
