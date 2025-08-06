import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProgressTracker } from "../progress-tracker";

describe("ProgressTracker", () => {
  it("renders all workflow phases", () => {
    render(<ProgressTracker />);

    expect(screen.getByText(/engage\/pre-discovery/i)).toBeInTheDocument();
    expect(screen.getByText(/discovery/i)).toBeInTheDocument();
    expect(screen.getByText(/quarterback lite/i)).toBeInTheDocument();
  });

  it("shows correct number of tasks for each phase", () => {
    render(<ProgressTracker />);

    // Check that each phase has tasks
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);
  });

  it("updates task completion status when checkbox is clicked", async () => {
    render(<ProgressTracker />);

    const firstCheckbox = screen.getAllByRole("checkbox")[0];

    expect(firstCheckbox).not.toBeChecked();

    fireEvent.click(firstCheckbox);

    await waitFor(() => {
      expect(firstCheckbox).toBeChecked();
    });
  });

  it("calculates phase completion percentage correctly", async () => {
    render(<ProgressTracker />);

    // Get all checkboxes in the first phase
    const checkboxes = screen.getAllByRole("checkbox");

    // Complete half of the tasks in first phase
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);

    await waitFor(() => {
      // Should show partial completion
      expect(screen.getByText(/40%|50%/)).toBeInTheDocument();
    });
  });

  it("shows overall progress across all phases", async () => {
    render(<ProgressTracker />);

    // Should show overall progress indicator
    expect(screen.getByText(/overall progress/i)).toBeInTheDocument();
    expect(screen.getByText(/0%/)).toBeInTheDocument();
  });

  it("updates overall progress when tasks are completed", async () => {
    render(<ProgressTracker />);

    const checkboxes = screen.getAllByRole("checkbox");

    // Complete several tasks
    fireEvent.click(checkboxes[0]);
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);

    await waitFor(() => {
      // Overall progress should be greater than 0
      const progressText = screen.getByText(/\d+%/);
      const percentage = parseInt(progressText.textContent || "0");
      expect(percentage).toBeGreaterThan(0);
    });
  });

  it("highlights current active phase", () => {
    render(<ProgressTracker />);

    // First phase should be active by default
    const firstPhase = screen
      .getByText(/engage\/pre-discovery/i)
      .closest("div");
    expect(firstPhase).toHaveClass(/active|current|primary/);
  });

  it("shows phase descriptions", () => {
    render(<ProgressTracker />);

    // Each phase should have a description
    expect(screen.getByText(/initial consultation/i)).toBeInTheDocument();
    expect(
      screen.getByText(/comprehensive business analysis/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/execution support/i)).toBeInTheDocument();
  });

  it("marks phase as complete when all tasks are done", async () => {
    render(<ProgressTracker />);

    // Get checkboxes for first phase (assuming 5 tasks)
    const checkboxes = screen.getAllByRole("checkbox").slice(0, 5);

    // Complete all tasks in first phase
    checkboxes.forEach((checkbox) => {
      fireEvent.click(checkbox);
    });

    await waitFor(() => {
      // Phase should show as complete
      expect(screen.getByText(/100%/)).toBeInTheDocument();
      const phaseElement = screen
        .getByText(/engage\/pre-discovery/i)
        .closest("div");
      expect(phaseElement).toHaveClass(/complete|completed/);
    });
  });

  it("allows unchecking completed tasks", async () => {
    render(<ProgressTracker />);

    const firstCheckbox = screen.getAllByRole("checkbox")[0];

    // Check then uncheck
    fireEvent.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    fireEvent.click(firstCheckbox);

    await waitFor(() => {
      expect(firstCheckbox).not.toBeChecked();
    });
  });

  it("shows task dependencies or order", () => {
    render(<ProgressTracker />);

    // Tasks should be numbered or show order
    expect(screen.getByText(/1\.|step 1/i)).toBeInTheDocument();
  });

  it("displays estimated timeline for each phase", () => {
    render(<ProgressTracker />);

    // Should show timeline estimates
    expect(screen.getByText(/weeks|months/i)).toBeInTheDocument();
  });

  it("persists progress state", async () => {
    const { rerender } = render(<ProgressTracker />);

    const firstCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(firstCheckbox);

    // Rerender component
    rerender(<ProgressTracker />);

    await waitFor(() => {
      // Progress should be maintained
      expect(screen.getAllByRole("checkbox")[0]).toBeChecked();
    });
  });

  it("shows completion date when phase is finished", async () => {
    render(<ProgressTracker />);

    // Complete all tasks in first phase
    const checkboxes = screen.getAllByRole("checkbox").slice(0, 5);
    checkboxes.forEach((checkbox) => fireEvent.click(checkbox));

    await waitFor(() => {
      // Should show completion date or "Completed" status
      expect(screen.getByText(/completed/i)).toBeInTheDocument();
    });
  });
});
