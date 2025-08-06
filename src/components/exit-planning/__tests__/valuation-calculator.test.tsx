import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ValuationCalculator } from "../valuation-calculator";

describe("ValuationCalculator", () => {
  it("renders all input fields", () => {
    render(<ValuationCalculator />);

    expect(screen.getByLabelText(/annual revenue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/profit margin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /calculate valuation/i }),
    ).toBeInTheDocument();
  });

  it("calculates valuation correctly for SaaS industry", async () => {
    render(<ValuationCalculator />);

    const revenueInput = screen.getByLabelText(/annual revenue/i);
    const marginInput = screen.getByLabelText(/profit margin/i);
    const industrySelect = screen.getByLabelText(/industry/i);
    const calculateButton = screen.getByRole("button", {
      name: /calculate valuation/i,
    });

    fireEvent.change(revenueInput, { target: { value: "1000000" } });
    fireEvent.change(marginInput, { target: { value: "20" } });
    fireEvent.change(industrySelect, { target: { value: "saas" } });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      // EBITDA = 1,000,000 * 0.20 = 200,000
      // SaaS multiple = 6
      // Valuation = 200,000 * 6 = 1,200,000
      expect(screen.getByText(/estimated valuation/i)).toBeInTheDocument();
      expect(screen.getByText(/\$1,200,000/)).toBeInTheDocument();
    });
  });

  it("calculates valuation correctly for Manufacturing industry", async () => {
    render(<ValuationCalculator />);

    const revenueInput = screen.getByLabelText(/annual revenue/i);
    const marginInput = screen.getByLabelText(/profit margin/i);
    const industrySelect = screen.getByLabelText(/industry/i);
    const calculateButton = screen.getByRole("button", {
      name: /calculate valuation/i,
    });

    fireEvent.change(revenueInput, { target: { value: "5000000" } });
    fireEvent.change(marginInput, { target: { value: "15" } });
    fireEvent.change(industrySelect, { target: { value: "manufacturing" } });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      // EBITDA = 5,000,000 * 0.15 = 750,000
      // Manufacturing multiple = 3
      // Valuation = 750,000 * 3 = 2,250,000
      expect(screen.getByText(/estimated valuation/i)).toBeInTheDocument();
      expect(screen.getByText(/\$2,250,000/)).toBeInTheDocument();
    });
  });

  it("shows EBITDA calculation", async () => {
    render(<ValuationCalculator />);

    const revenueInput = screen.getByLabelText(/annual revenue/i);
    const marginInput = screen.getByLabelText(/profit margin/i);
    const calculateButton = screen.getByRole("button", {
      name: /calculate valuation/i,
    });

    fireEvent.change(revenueInput, { target: { value: "2000000" } });
    fireEvent.change(marginInput, { target: { value: "25" } });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/ebitda/i)).toBeInTheDocument();
      expect(screen.getByText(/\$500,000/)).toBeInTheDocument();
    });
  });

  it("shows industry multiple", async () => {
    render(<ValuationCalculator />);

    const industrySelect = screen.getByLabelText(/industry/i);
    const calculateButton = screen.getByRole("button", {
      name: /calculate valuation/i,
    });

    fireEvent.change(industrySelect, { target: { value: "healthcare" } });
    fireEvent.change(screen.getByLabelText(/annual revenue/i), {
      target: { value: "1000000" },
    });
    fireEvent.change(screen.getByLabelText(/profit margin/i), {
      target: { value: "20" },
    });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/industry multiple/i)).toBeInTheDocument();
      expect(screen.getByText(/5x/)).toBeInTheDocument(); // Healthcare multiple
    });
  });

  it("validates input fields", async () => {
    render(<ValuationCalculator />);

    const calculateButton = screen.getByRole("button", {
      name: /calculate valuation/i,
    });
    fireEvent.click(calculateButton);

    // Should not show valuation without valid inputs
    expect(screen.queryByText(/estimated valuation/i)).not.toBeInTheDocument();
  });

  it("handles negative values appropriately", async () => {
    render(<ValuationCalculator />);

    const revenueInput = screen.getByLabelText(/annual revenue/i);
    const marginInput = screen.getByLabelText(/profit margin/i);
    const calculateButton = screen.getByRole("button", {
      name: /calculate valuation/i,
    });

    fireEvent.change(revenueInput, { target: { value: "1000000" } });
    fireEvent.change(marginInput, { target: { value: "-10" } }); // Negative margin
    fireEvent.click(calculateButton);

    await waitFor(() => {
      // Should still calculate but show negative EBITDA
      expect(screen.getByText(/ebitda/i)).toBeInTheDocument();
      // Negative valuations should be handled gracefully
    });
  });

  it("formats large numbers correctly", async () => {
    render(<ValuationCalculator />);

    const revenueInput = screen.getByLabelText(/annual revenue/i);
    const marginInput = screen.getByLabelText(/profit margin/i);
    const calculateButton = screen.getByRole("button", {
      name: /calculate valuation/i,
    });

    fireEvent.change(revenueInput, { target: { value: "10000000" } }); // 10M
    fireEvent.change(marginInput, { target: { value: "30" } });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      // Should format as $18,000,000 (10M * 0.3 * 6 for default industry)
      expect(screen.getByText(/\$18,000,000/)).toBeInTheDocument();
    });
  });
});
