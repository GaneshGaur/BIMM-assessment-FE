import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarSearch } from "../CarSearch";

describe("CarSearch", () => {
  it("renders search input with placeholder and accessibility label", () => {
    render(<CarSearch value="" onChange={jest.fn()} />);

    const input = screen.getByRole("textbox", { name: "Search cars by model" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Filter by model (e.g. Q5, A3, R8)...");
  });

  it("calls onChange when typing into the input", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<CarSearch value="" onChange={handleChange} />);
    const input = screen.getByRole("textbox", { name: "Search cars by model" });

    await user.type(input, "Q5");
    expect(handleChange).toHaveBeenCalled();
  });

  it("renders clear button when value is present and clears search on click", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<CarSearch value="Audi" onChange={handleChange} />);

    const clearButton = screen.getByRole("button", { name: "Clear search" });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(handleChange).toHaveBeenCalledWith("");
  });

  it("does not render clear button when search is empty", () => {
    render(<CarSearch value="" onChange={jest.fn()} />);

    expect(screen.queryByRole("button", { name: "Clear search" })).not.toBeInTheDocument();
  });
});
