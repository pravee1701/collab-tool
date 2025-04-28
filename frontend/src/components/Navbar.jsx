import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 shadow-sm bg-card">
      <Link to="/" className="text-xl font-bold">
        CodeSandbox Clone
      </Link>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
      </div>
    </nav>
  );
}
