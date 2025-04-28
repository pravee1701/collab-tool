import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axiosInstance";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ResendEmailVerification() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResend = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post("/user/resend-email-verification", { email });
      toast.success("Verification email sent! Please check your inbox.");
      setEmail("");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to send verification email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Resend Email Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResend} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send Verification Email"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
