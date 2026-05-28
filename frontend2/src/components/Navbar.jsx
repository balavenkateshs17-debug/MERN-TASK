import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useEffect, useState } from "react";

function Navbar() {
  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());

  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className="navbar">
      <div className="container nav-content">
        <h2>Task Manager</h2>
        <div className="nav-actions">
          <button
            className="btn secondary-btn nav-btn"
            onClick={() => setDark((v) => !v)}
          >
            {dark ? "Light" : "Dark"}
          </button>

          <button className="btn nav-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
