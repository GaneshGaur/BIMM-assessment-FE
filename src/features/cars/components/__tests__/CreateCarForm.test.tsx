import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateCarForm } from "../CreateCarForm";

describe("CreateCarForm", () => {
  it("does not render dialog content when open is false", () => {
    render(
      <CreateCarForm
        open={false}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.queryByTestId("create-car-dialog")).not.toBeInTheDocument();
  });

  it("renders all form inputs when open is true", () => {
    render(
      <CreateCarForm
        open={true}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByRole("heading", { name: "Add New Vehicle" })).toBeInTheDocument();
    expect(screen.getByTestId("create-car-make-input")).toBeInTheDocument();
    expect(screen.getByTestId("create-car-model-input")).toBeInTheDocument();
    expect(screen.getByTestId("create-car-year-input")).toBeInTheDocument();
    expect(screen.getByTestId("create-car-color-input")).toBeInTheDocument();
  });

  it("validates required fields on submit and displays error helper texts", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(
      <CreateCarForm
        open={true}
        onClose={jest.fn()}
        onSubmit={handleSubmit}
      />
    );

    const submitBtn = screen.getByTestId("create-car-submit-button");
    await user.click(submitBtn);

    expect(await screen.findByText("Make is required")).toBeInTheDocument();
    expect(await screen.findByText("Model is required")).toBeInTheDocument();
    expect(await screen.findByText("Color is required")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid form data correctly", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn().mockResolvedValue({});
    const handleClose = jest.fn();

    render(
      <CreateCarForm
        open={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    await user.type(screen.getByTestId("create-car-make-input"), "Audi");
    await user.type(screen.getByTestId("create-car-model-input"), "RS e-tron GT");
    await user.clear(screen.getByTestId("create-car-year-input"));
    await user.type(screen.getByTestId("create-car-year-input"), "2025");
    await user.type(screen.getByTestId("create-car-color-input"), "Tactical Green");

    await user.click(screen.getByTestId("create-car-submit-button"));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          make: "Audi",
          model: "RS e-tron GT",
          year: 2025,
          color: "Tactical Green",
        })
      );
    });
  });

  it("displays server error alert when serverError prop is supplied", () => {
    render(
      <CreateCarForm
        open={true}
        onClose={jest.fn()}
        onSubmit={jest.fn()}
        serverError="Server error: make and model are required"
      />
    );

    expect(screen.getByTestId("create-car-error")).toHaveTextContent(
      "Server error: make and model are required"
    );
  });
});
