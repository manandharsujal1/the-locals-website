import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <Link to="/" className="site-logo">
      <img
        src="/images/logo.png"
        alt="The Locals Kathmandu"
      />
    </Link>
  );
}