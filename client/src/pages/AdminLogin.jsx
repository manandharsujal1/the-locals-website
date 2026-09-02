import { useState } from "react";
import {
  useNavigate
} from "react-router-dom";

import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";

import Logo from "../components/Logo";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API}/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Login failed."
        );
      }

      localStorage.setItem(
        "locals_admin_token",
        data.token
      );

      localStorage.setItem(
        "locals_admin_user",
        JSON.stringify(
          data.user || {}
        )
      );

      navigate(
        "/admin",
        {
          replace: true
        }
      );

    } catch (err) {
      setError(
        err.message ||
        "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="admin-login-page">

      <div className="admin-login-pattern" />

      <section className="admin-login-shell">

        <div className="admin-login-brand">

          <Logo />

          <span>
            THE LOCALS
          </span>

          <h1>
            Admin
            <em> Portal.</em>
          </h1>

          <p>
            Secure access to events,
            applications, submissions
            and website management.
          </p>

          <div className="admin-login-brand-line" />

          <small>
            Kathmandu · Nepal
          </small>

        </div>


        <div className="admin-login-card">

          <div className="admin-login-card-head">

            <span>
              Secure Access
            </span>

            <h2>
              Welcome back.
            </h2>

            <p>
              Sign in to continue to
              The Locals admin dashboard.
            </p>

          </div>


          <form
            onSubmit={handleSubmit}
          >

            <label>
              <span>
                Email address
              </span>

              <div className="admin-login-input">

                <Mail size={17} />

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="admin@thelocals.com"
                  required
                />

              </div>
            </label>


            <label>
              <span>
                Password
              </span>

              <div className="admin-login-input">

                <Lock size={17} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      (value) =>
                        !value
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>

              </div>
            </label>


            {error && (
              <div className="admin-login-error">
                {error}
              </div>
            )}


            <button
              type="submit"
              className="admin-login-submit"
              disabled={loading}
            >
              <span>
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </span>

              {!loading && (
                <ArrowRight size={17} />
              )}
            </button>

          </form>


          <div className="admin-login-foot">
            <span>
              The Locals Kathmandu
            </span>

            <span>
              Authorized access only
            </span>
          </div>

        </div>

      </section>

    </main>
  );
}