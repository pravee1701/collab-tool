import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes"; // Correct import for shadcn UI setup

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  if (!theme) return null; // Optional: Prevent issues on first render

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-full bg-muted hover:bg-muted-foreground transition"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </button>
  );
}
