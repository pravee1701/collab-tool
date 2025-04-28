import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";

export default function SocialAuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    if (token) {
      const userData = { token }; // depends how your backend sends
      dispatch(login(userData))
        .unwrap()
        .then(() => {
          navigate("/");
        })
        .catch(() => {
          toast.error("Social login failed.");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [location, dispatch, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Processing social login...</p>
    </div>
  );
}
