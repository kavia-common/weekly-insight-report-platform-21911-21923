import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ReportsList from "../pages/reports/ReportsList";
import ReportCreate from "../pages/reports/ReportCreate";
import ReportDetail from "../pages/reports/ReportDetail";
import ReportEdit from "../pages/reports/ReportEdit";

// Mock the API layer
jest.mock("../api/client", () => {
  const actual = jest.requireActual("../api/client");
  return {
    ...actual,
    reports: {
      listReports: jest.fn(),
      createReport: jest.fn(),
      getReport: jest.fn(),
      updateReport: jest.fn(),
      deleteReport: jest.fn(),
    },
  };
});

import { reports as reportsApi } from "../api/client";

describe("Reports pages", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("ReportsList displays items and allows pagination/filter interactions", async () => {
    reportsApi.listReports.mockResolvedValueOnce([
      { id: "r1", status: "draft", week: "2025-05", content: "Content 1", updatedAt: "2025-01-01" },
      { id: "r2", status: "submitted", week: "2025-06", content: "Content 2", updatedAt: "2025-01-02" },
    ]);

    render(
      <MemoryRouter initialEntries={["/reports"]}>
        <Routes>
          <Route path="/reports" element={<ReportsList />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/weekly reports/i)).toBeInTheDocument();
    expect(screen.getByText(/content 1/i)).toBeInTheDocument();
    expect(screen.getByText(/content 2/i)).toBeInTheDocument();

    // Change a filter triggers a new API call
    reportsApi.listReports.mockResolvedValueOnce([
      { id: "r3", status: "approved", week: "2025-07", content: "Approved", updatedAt: "2025-01-03" },
    ]);
    fireEvent.change(screen.getByLabelText(/^status$/i), { target: { value: "approved" } });

    expect(await screen.findByText(/approved/i)).toBeInTheDocument();
  });

  test("ReportCreate submits and navigates to detail", async () => {
    reportsApi.createReport.mockResolvedValueOnce({ id: "r10" });

    render(
      <MemoryRouter initialEntries={["/reports/new"]}>
        <Routes>
          <Route path="/reports/new" element={<ReportCreate />} />
          <Route path="/reports/:id" element={<div>Detail Page</div>} />
          <Route path="/reports" element={<div>List Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // Fill form: content is required (min 10 chars)
    fireEvent.change(screen.getByLabelText(/report content/i), {
      target: { value: "This is a valid report content" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create report/i }));

    await waitFor(() => {
      expect(reportsApi.createReport).toHaveBeenCalled();
    });
  });

  test("ReportDetail loads, shows item and supports delete flow", async () => {
    reportsApi.getReport.mockResolvedValueOnce({
      id: "r20",
      status: "submitted",
      week: "2025-01",
      content: "My report",
      blockers: ["X", "Y"],
    });
    reportsApi.deleteReport.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={["/reports/r20"]}>
        <Routes>
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/reports" element={<div>List Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/report details/i)).toBeInTheDocument();
    expect(screen.getByText(/my report/i)).toBeInTheDocument();

    // Trigger delete flow
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    // Confirm modal opens
    expect(screen.getByRole("dialog", { name: /delete report\?/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /^delete$/i }));
    await waitFor(() => {
      expect(reportsApi.deleteReport).toHaveBeenCalledWith("r20");
    });
  });

  test("ReportEdit loads, updates and navigates back", async () => {
    reportsApi.getReport.mockResolvedValueOnce({
      id: "r30",
      status: "draft",
      week: "2025-02",
      content: "Initial content goes here",
      blockers: [],
    });
    reportsApi.updateReport.mockResolvedValueOnce({
      id: "r30",
      content: "Updated content",
    });

    render(
      <MemoryRouter initialEntries={["/reports/r30/edit"]}>
        <Routes>
          <Route path="/reports/:id/edit" element={<ReportEdit />} />
          <Route path="/reports/:id" element={<div>Detail Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const contentBox = await screen.findByLabelText(/report content/i);
    fireEvent.change(contentBox, { target: { value: "Updated content goes here" } });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(reportsApi.updateReport).toHaveBeenCalledWith("r30", expect.any(Object));
    });
  });
});
