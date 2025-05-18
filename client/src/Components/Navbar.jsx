import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/about", label: "About" },
];

const Navbar = ({ currentPath }) => {
  const { isAdmin } = useAuth();

  return (
    <nav className="navbar">
      <ul className="navbar_links">
        {navLinks.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                isActive || (link.exact && currentPath === link.to)
                  ? "active-navbar-link"
                  : undefined
              }
              end={!!link.exact}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
        {isAdmin && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) => (isActive ? "active-navbar-link" : undefined)}
            >
              Admin
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;