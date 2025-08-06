import { describe, it, expect, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/test/utils/test-utils";
import { TaskList } from "../TaskList";
import { createMockTasks } from "@/test/factories/task.factory";
import { TaskStatus, TaskPriority } from "@/types/task";

describe("TaskList", () => {
  const mockTasks = createMockTasks(5);

  it("renders list of tasks", () => {
    render(<TaskList tasks={mockTasks} />);

    mockTasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it("filters tasks by status", async () => {
    const user = userEvent.setup();
    const tasksWithStatuses = [
      createMockTasks(2, { status: TaskStatus.TODO }),
      createMockTasks(2, { status: TaskStatus.IN_PROGRESS }),
      createMockTasks(1, { status: TaskStatus.COMPLETED }),
    ].flat();

    render(<TaskList tasks={tasksWithStatuses} />);

    // Click on "In Progress" filter
    const filterButton = screen.getByRole("button", {
      name: /filter by status/i,
    });
    await user.click(filterButton);

    const inProgressOption = screen.getByRole("option", {
      name: /in progress/i,
    });
    await user.click(inProgressOption);

    await waitFor(() => {
      const visibleTasks = screen.getAllByTestId("task-item");
      expect(visibleTasks).toHaveLength(2);
    });
  });

  it("sorts tasks by priority", async () => {
    const user = userEvent.setup();
    const tasksWithPriorities = [
      createMockTasks(1, {
        priority: TaskPriority.LOW,
        title: "Low priority task",
      }),
      createMockTasks(1, {
        priority: TaskPriority.URGENT,
        title: "Urgent task",
      }),
      createMockTasks(1, {
        priority: TaskPriority.MEDIUM,
        title: "Medium priority task",
      }),
    ].flat();

    render(<TaskList tasks={tasksWithPriorities} />);

    const sortButton = screen.getByRole("button", { name: /sort by/i });
    await user.click(sortButton);

    const priorityOption = screen.getByRole("option", { name: /priority/i });
    await user.click(priorityOption);

    await waitFor(() => {
      const taskItems = screen.getAllByTestId("task-item");
      expect(within(taskItems[0]).getByText("Urgent task")).toBeInTheDocument();
      expect(
        within(taskItems[2]).getByText("Low priority task"),
      ).toBeInTheDocument();
    });
  });

  it("searches tasks by title", async () => {
    const user = userEvent.setup();
    const tasks = [
      createMockTasks(1, { title: "Review financial statements" }),
      createMockTasks(1, { title: "Update business plan" }),
      createMockTasks(1, { title: "Schedule legal consultation" }),
    ].flat();

    render(<TaskList tasks={tasks} />);

    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await user.type(searchInput, "financial");

    await waitFor(() => {
      expect(
        screen.getByText("Review financial statements"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Update business plan"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Schedule legal consultation"),
      ).not.toBeInTheDocument();
    });
  });

  it("handles task status update", async () => {
    const user = userEvent.setup();
    const onUpdateTask = vi.fn();
    const task = createMockTasks(1, { status: TaskStatus.TODO })[0];

    render(<TaskList tasks={[task]} onUpdateTask={onUpdateTask} />);

    const statusButton = screen.getByRole("button", {
      name: /mark as in progress/i,
    });
    await user.click(statusButton);

    await waitFor(() => {
      expect(onUpdateTask).toHaveBeenCalledWith(task.id, {
        status: TaskStatus.IN_PROGRESS,
      });
    });
  });

  it("handles task deletion", async () => {
    const user = userEvent.setup();
    const onDeleteTask = vi.fn();
    const task = createMockTasks(1)[0];

    render(<TaskList tasks={[task]} onDeleteTask={onDeleteTask} />);

    const moreButton = screen.getByRole("button", { name: /more options/i });
    await user.click(moreButton);

    const deleteButton = screen.getByRole("menuitem", { name: /delete/i });
    await user.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByRole("button", {
      name: /confirm delete/i,
    });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(onDeleteTask).toHaveBeenCalledWith(task.id);
    });
  });

  it("displays empty state when no tasks", () => {
    render(<TaskList tasks={[]} />);

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create new task/i }),
    ).toBeInTheDocument();
  });

  it("handles bulk task operations", async () => {
    const user = userEvent.setup();
    const onBulkUpdate = vi.fn();
    const tasks = createMockTasks(3);

    render(<TaskList tasks={tasks} onBulkUpdate={onBulkUpdate} />);

    // Select all tasks
    const selectAllCheckbox = screen.getByRole("checkbox", {
      name: /select all/i,
    });
    await user.click(selectAllCheckbox);

    // Click bulk action button
    const bulkActionButton = screen.getByRole("button", {
      name: /bulk actions/i,
    });
    await user.click(bulkActionButton);

    // Mark all as completed
    const markCompletedOption = screen.getByRole("menuitem", {
      name: /mark as completed/i,
    });
    await user.click(markCompletedOption);

    await waitFor(() => {
      expect(onBulkUpdate).toHaveBeenCalledWith(
        tasks.map((t) => t.id),
        { status: TaskStatus.COMPLETED },
      );
    });
  });
});
