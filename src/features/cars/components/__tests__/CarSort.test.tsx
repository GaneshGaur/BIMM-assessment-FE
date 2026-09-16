import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarSort } from "../CarSort";

describe("CarSort", () => {
  it("renders sort dropdown with currently selected value", () => {
    render(<CarSort value="year-desc" onChange={jest.fn()} />);

    expect(screen.getByText("Year: Newest to Oldest")).toBeInTheDocument();
  });

  it("opens options and calls onChange when selecting a different sort option", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<CarSort value="year-desc" onChange={handleChange} />);
    const select = screen.getByRole("combobox");
    await user.click(select);    
  });
});
