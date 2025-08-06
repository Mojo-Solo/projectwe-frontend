import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ReadinessAssessment } from "../readiness-assessment";

describe("ReadinessAssessment", () => {
  it("renders all assessment dimensions", () => {
    render(<ReadinessAssessment />);

    expect(screen.getByText(/financial readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/operations readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/legal readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/market readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/management readiness/i)).toBeInTheDocument();
    expect(screen.getByText(/strategic readiness/i)).toBeInTheDocument();
  });

  it("updates score when slider is moved", async () => {
    render(<ReadinessAssessment />);

    const financialSlider = screen.getAllByRole("slider")[0];

    // Move slider to 80
    fireEvent.change(financialSlider, { target: { value: "80" } });

    await waitFor(() => {
      // Check if the score label updates
      expect(screen.getByText(/80/)).toBeInTheDocument();
    });
  });

  it("calculates overall readiness score correctly", async () => {
    render(<ReadinessAssessment />);

    const sliders = screen.getAllByRole("slider");

    // Set all dimensions to 60
    sliders.forEach((slider) => {
      fireEvent.change(slider, { target: { value: "60" } });
    });

    const calculateButton = screen.getByRole("button", {
      name: /calculate readiness/i,
    });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/overall readiness score/i)).toBeInTheDocument();
      expect(screen.getByText(/60%/)).toBeInTheDocument();
    });
  });

  it("shows correct readiness level for low scores", async () => {
    render(<ReadinessAssessment />);

    const sliders = screen.getAllByRole("slider");

    // Set all dimensions to 30 (low score)
    sliders.forEach((slider) => {
      fireEvent.change(slider, { target: { value: "30" } });
    });

    const calculateButton = screen.getByRole("button", {
      name: /calculate readiness/i,
    });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(
        screen.getByText(/needs significant preparation/i),
      ).toBeInTheDocument();
    });
  });

  it("shows correct readiness level for medium scores", async () => {
    render(<ReadinessAssessment />);

    const sliders = screen.getAllByRole("slider");

    // Set all dimensions to 65 (medium score)
    sliders.forEach((slider) => {
      fireEvent.change(slider, { target: { value: "65" } });
    });

    const calculateButton = screen.getByRole("button", {
      name: /calculate readiness/i,
    });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/moderately ready/i)).toBeInTheDocument();
    });
  });

  it("shows correct readiness level for high scores", async () => {
    render(<ReadinessAssessment />);

    const sliders = screen.getAllByRole("slider");

    // Set all dimensions to 85 (high score)
    sliders.forEach((slider) => {
      fireEvent.change(slider, { target: { value: "85" } });
    });

    const calculateButton = screen.getByRole("button", {
      name: /calculate readiness/i,
    });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(
        screen.getByText(/well.prepared|ready.to.exit/i),
      ).toBeInTheDocument();
    });
  });

  it("identifies weak areas correctly", async () => {
    render(<ReadinessAssessment />);

    const sliders = screen.getAllByRole("slider");

    // Set financial to 30 (weak), others to 80
    fireEvent.change(sliders[0], { target: { value: "30" } }); // Financial
    for (let i = 1; i < sliders.length; i++) {
      fireEvent.change(sliders[i], { target: { value: "80" } });
    }

    const calculateButton = screen.getByRole("button", {
      name: /calculate readiness/i,
    });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(
        screen.getByText(/areas needing improvement/i),
      ).toBeInTheDocument();
      expect(screen.getByText(/financial readiness/i)).toBeInTheDocument();
    });
  });

  it("shows progress indicator for each dimension", () => {
    render(<ReadinessAssessment />);

    const sliders = screen.getAllByRole("slider");

    // Check that each slider has min, max, and current value
    sliders.forEach((slider) => {
      expect(slider).toHaveAttribute("min", "0");
      expect(slider).toHaveAttribute("max", "100");
      expect(slider).toHaveAttribute("value", "50"); // Default value
    });
  });

  it("provides recommendations based on scores", async () => {
    render(<ReadinessAssessment />);

    const sliders = screen.getAllByRole("slider");

    // Set operations to low score
    fireEvent.change(sliders[1], { target: { value: "25" } }); // Operations

    const calculateButton = screen.getByRole("button", {
      name: /calculate readiness/i,
    });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/recommendations/i)).toBeInTheDocument();
      // Should show operations-related recommendations
      expect(
        screen.getByText(/operations|processes|efficiency/i),
      ).toBeInTheDocument();
    });
  });

  it("handles edge cases with all zeros", async () => {
    render(<ReadinessAssessment />);

    const sliders = screen.getAllByRole("slider");

    // Set all to 0
    sliders.forEach((slider) => {
      fireEvent.change(slider, { target: { value: "0" } });
    });

    const calculateButton = screen.getByRole("button", {
      name: /calculate readiness/i,
    });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/0%/)).toBeInTheDocument();
      expect(
        screen.getByText(/needs significant preparation/i),
      ).toBeInTheDocument();
    });
  });

  it("handles edge cases with all maximums", async () => {
    render(<ReadinessAssessment />);

    const sliders = screen.getAllByRole("slider");

    // Set all to 100
    sliders.forEach((slider) => {
      fireEvent.change(slider, { target: { value: "100" } });
    });

    const calculateButton = screen.getByRole("button", {
      name: /calculate readiness/i,
    });
    fireEvent.click(calculateButton);

    await waitFor(() => {
      expect(screen.getByText(/100%/)).toBeInTheDocument();
      expect(
        screen.getByText(/ready.to.exit|fully.prepared/i),
      ).toBeInTheDocument();
    });
  });
});
