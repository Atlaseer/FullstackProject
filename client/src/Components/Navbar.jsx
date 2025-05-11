import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Home", exact: true },
  { to: "/about", label: "About" },
];

const Navbar = ({ currentPath }) => {
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
      </ul>
    </nav>
  );
};

export default Navbar;