import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {axiosInstance} from "../lib/axiosInstance";
import { toast } from "react-hot-toast";

export default function VerifyEmail() {
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axiosInstance.get(`/verify-email/${verificationToken}`);
        toast.success("Email verified successfully!");
        navigate("/dashboard");
      } catch (err) {
        toast.error(err.response?.data?.message || "Verification failed");
        navigate("/");
      }
    };
    verifyEmail();
  }, [verificationToken, navigate]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <h1 className="text-2xl font-bold">Verifying...</h1>
    </div>
  );
}
