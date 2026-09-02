import {
  Routes,
  Route
} from "react-router-dom";

import Layout from "./components/Layout";

import ProtectedAdminRoute
  from "./components/ProtectedAdminRoute";

import Home
  from "./pages/Home";

import Events
  from "./pages/Events";

import About
  from "./pages/About";

import Team
  from "./pages/Team";

import Contact
  from "./pages/Contact";

import Support
  from "./pages/Support";

import Join
  from "./pages/Join";

import Admin
  from "./pages/Admin";

import AdminLogin
  from "./pages/AdminLogin";

import EventDetail from "./pages/EventDetail";

export default function App() {
  return (
    <Routes>

      {/* =========================
          PUBLIC WEBSITE
      ========================== */}

      <Route element={<Layout />}>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/team"
          element={<Team />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/support"
          element={<Support />}
        />

        <Route
          path="/join"
          element={<Join />}
        />

        <Route
  path="/events/:id"
  element={<EventDetail />}
/>

      </Route>


      {/* =========================
          ADMIN LOGIN
      ========================== */}

      <Route
        path="/admin/login"
        element={<AdminLogin />}
      />


      {/* =========================
          PROTECTED ADMIN
      ========================== */}

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <Admin />
          </ProtectedAdminRoute>
        }
      />

    </Routes>
  );
}