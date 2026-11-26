import { Link, NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  "rounded-lg px-3 py-2 text-sm font-medium transition " +
  (isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100");

const Navbar = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-sm font-bold text-white">
            RA
          </span>
          <span className="font-semibold">Resume Analyzer</span>
        </Link>
        <nav className="flex gap-1">
          <NavLink to="/" end className={linkClass}>
            Analyze
          </NavLink>
          <NavLink to="/history" className={linkClass}>
            History
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
