import { useState } from "react";
import {
  Link,
  NavLink,
  Outlet
} from "react-router-dom";

import {
  Menu,
  X,
  Instagram,
  Facebook,
  Mail,
  ArrowUpRight
} from "lucide-react";

import Logo from "./Logo";

const links = [
  ["/", "Home"],
  ["/events", "Our Events"],
  ["/about", "About Us"],
  ["/team", "Our Team"],
  ["/contact", "Contact"]
];

export default function Layout() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <div className="site-shell">

      {/* =========================
          HEADER
      ========================== */}

      <header className="header">

        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
          aria-label="The Locals Kathmandu Home"
        >
          <Logo />
        </Link>

        <nav className={`nav ${open ? "open" : ""}`}>

          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "active" : ""
              }
            >
              {label}
            </NavLink>
          ))}

          <Link
            to="/support"
            className="nav-cta"
            onClick={closeMenu}
          >
            Support Us
            <ArrowUpRight size={16} />
          </Link>

        </nav>

        <button
          type="button"
          className="menu-btn"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================== */}

      <main>
        <Outlet />
      </main>


      {/* =========================
          FOOTER
      ========================== */}

      <footer className="footer">

        <div className="footer-main">

          {/* BRAND */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo-link"
              aria-label="The Locals Kathmandu Home"
            >
              <Logo />
            </Link>

            <p>
              Culture. Community. Celebration.
              <br />
              Made in Kathmandu, shared with everyone.
            </p>

          </div>


          {/* EXPLORE */}

          <div className="footer-column">

            <h4>Explore</h4>

            {links.slice(1).map(([to, label]) => (
              <Link
                key={to}
                to={to}
              >
                {label}
              </Link>
            ))}

            <Link to="/support">
              Support Us
            </Link>

          </div>


          {/* SOCIAL */}

          <div className="footer-column">

            <h4>Connect</h4>

            <a href="mailto:hello@thelocals.com">
              <Mail size={16} />
              Email us
            </a>

            <a
              href="https://instagram.com/thelocals_kathmandu"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={16} />
              Instagram
            </a>

            <a
              href="#"
              aria-label="The Locals Facebook"
            >
              <Facebook size={16} />
              Facebook
            </a>

          </div>

        </div>


        {/* FOOTER BOTTOM */}

        <div className="footer-bottom">

          <span>
            © {new Date().getFullYear()} The Locals Kathmandu.
            All rights reserved.
          </span>

          <Link to="/admin">
            Admin
          </Link>

        </div>

      </footer>

    </div>
  );
}