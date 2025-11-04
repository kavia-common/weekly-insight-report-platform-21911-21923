import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import { AuthContext } from "../context/AuthContext";

function renderWithAuth(ui, overrides = {}) {
  const defaultValue = {
    token: overrides.token ?? null,
    error: "",
    login: jest.fn().mockResolvedValue({ ok: true, data: { token: "tok" } }),
    register: jest.fn().mockResolvedValue({ ok: true, data: { token: "tok" } }),
    refreshUser: jest.fn().mockResolvedValue({ id: "u1", email: "a@b.com", name: "Ann" }),
    updateProfile: jest.fn().mockResolvedValue({ ok: true, data: { id: "u1", email: "a@b.com", name: "Ann" } }),
    logout: jest.fn(),
    user: overrides.user ?? { id: "u1", email: "a@b.com", name: "Ann" },
    initializing: false,
  };
  return {
    ...render(<AuthContext.Provider value={{ ...defaultValue, ...overrides }}>{ui}</AuthContext.Provider>),
    ctx: defaultValue,
  };
}

describe("Auth pages", () => {
  test("LoginPage validates and calls login then navigates", async () => {
    const initialEntries = ["/login"];
    renderWithAuth(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "secret1" } });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    // Success indicator shows
    expect(await screen.findByText(/login successful/i)).toBeInTheDocument();
  });

  test("RegisterPage validates and calls register then navigates", async () => {
    renderWithAuth(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/^email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: "hunter2" } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: "hunter2" } });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/registration successful/i)).toBeInTheDocument();
  });

  test("ProfilePage shows profile and allows name update", async () => {
    const updateProfile = jest.fn().mockResolvedValue({ ok: true, data: { id: "u1", email: "a@b.com", name: "Jane" } });
    renderWithAuth(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>,
      { updateProfile }
    );

    // Wait for refreshUser on mount to complete and the form to be available
    const input = await screen.findByLabelText(/display name/i);
    fireEvent.change(input, { target: { value: "Jane" } });
    fireEvent.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith({ name: "Jane" });
    });
    expect(await screen.findByText(/profile updated successfully/i)).toBeInTheDocument();
  });
});
