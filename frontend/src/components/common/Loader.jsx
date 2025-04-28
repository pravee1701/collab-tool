import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
    </div>
  );
}
