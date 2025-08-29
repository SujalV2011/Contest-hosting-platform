// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AttendeeDashboard from "./pages/AttendeeDashboard";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import CreateContest from "./pages/CreateContest";
import Navbar from "./components/Navbar";

/* ───────────────────────── Protected wrapper ───────────────────────── */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  return token ? children : null;
};

/* ──────────────────────── role-based home redirect ─────────────────── */
const HomeRedirect = () => {
  const role = localStorage.getItem("userRole");
  return (
    <Navigate
      to={role === "organizer" ? "/organizer-dashboard" : "/attendee-dashboard"}
      replace
    />
  );
};

/* ───────────────────────── Navbar + outlet layout ──────────────────── */
const Layout = ({ children }) => {
  const role = localStorage.getItem("userRole");

  const additionalLinks =
    role === "organizer"
      ? [{ to: "/organize-event", text: "Organize Event" }]
      : role === "attendee"
      ? [{ to: "/contests", text: "Contests" }]
      : [];

  return (
    <>
      <Navbar additionalLinks={additionalLinks} />
      {children}
    </>
  );
};

/* ────────────────────────────── App root ───────────────────────────── */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* ── public ────────────────────────────────────────────── */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <LoginPage />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <SignupPage />
            </Layout>
          }
        />

        {/* ── protected dashboards ─────────────────────────────── */}
        <Route
          path="/attendee-dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <AttendeeDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer-dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <OrganizerDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ── protected contest builder ─────────────────────────── */}
        <Route
          path="/organize-event"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateContest />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* ── role-aware home redirect for logged-in users ───────── */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomeRedirect />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
