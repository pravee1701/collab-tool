import { Button } from "@/components/ui/button";
import { Github, Chrome } from "lucide-react";

const GOOGLE_URL = `${import.meta.env.VITE_API_URL}/google`;
const GITHUB_URL = `${import.meta.env.VITE_API_URL}/github`;

export function SocialLogin() {
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_URL;
  };

  const handleGithubLogin = () => {
    window.location.href = GITHUB_URL;
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={handleGoogleLogin}
      >
        <Chrome className="h-5 w-5" />
        Continue with Google
      </Button>
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={handleGithubLogin}
      >
        <Github className="h-5 w-5" />
        Continue with GitHub
      </Button>
    </div>
  );
}
