import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.username} 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6 flex flex-col items-center">
            <User className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold">Profile</h2>
            <p className="text-muted-foreground mt-2 text-center">
              View and update your personal information
            </p>
            <Button asChild className="mt-4">
              <Link to="/profile">Go to Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6 flex flex-col items-center">
            <User className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold">API Keys</h2>
            <p className="text-muted-foreground mt-2 text-center">
              Manage your API keys for accessing services
            </p>
            <Button asChild className="mt-4">
              <Link to="/api-keys">Manage API Keys</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6 flex flex-col items-center">
            <User className="h-12 w-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold">Settings</h2>
            <p className="text-muted-foreground mt-2 text-center">
              Change password, update preferences
            </p>
            <Button asChild className="mt-4">
              <Link to="/settings/change-password">Go to Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
