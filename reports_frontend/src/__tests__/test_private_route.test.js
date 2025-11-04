import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import PrivateRoute from "../components/PrivateRoute";
import { AuthContext } from "../context/AuthContext";

function renderWithAuth(ui, { token = null, initializing = false } = {}) {
  const value = { token, initializing };
  return render(<AuthContext.Provider value={value}>{ui}</AuthContext.Provider>);
}

describe("PrivateRoute", () => {
  test("redirects to /login when unauthenticated", () => {
    renderWithAuth(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<div>Profile</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
      { token: null }
    );
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test("renders protected content when authenticated", () => {
    renderWithAuth(
      <MemoryRouter initialEntries={["/profile"]}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<div>Profile OK</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
      { token: "tkn" }
    );
    expect(screen.getByText(/profile ok/i)).toBeInTheDocument();
  });
});
