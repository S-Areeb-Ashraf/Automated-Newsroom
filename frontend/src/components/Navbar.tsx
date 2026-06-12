import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    "nav__link" + (isActive ? " nav__link--active" : "");

  return (
    <header className={"nav" + (scrolled ? " nav--scrolled" : "")}>
      <div className="nav__inner container">
        <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>
          <span className="nav__logo" aria-hidden>𝔽</span>
          <span className="nav__brand-text">
            <span className="nav__brand-name">Faxum Press</span>
            <span className="nav__brand-tag">Automated Newsroom</span>
          </span>
        </NavLink>

        <button
          type="button"
          className={"nav__toggle" + (open ? " nav__toggle--open" : "")}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={"nav__links" + (open ? " nav__links--open" : "")}>
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" className={linkClass} onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="nav__cta"
          >
            API Docs ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
