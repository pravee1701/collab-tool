import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { forgotPassword } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    dispatch(forgotPassword(data.email))
      .unwrap()
      .then(() => {
        toast.success("Password reset link sent to your email.");
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err?.message || "Something went wrong.");
      });
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("email", { required: "Email is required" })}
          placeholder="Enter your email"
          type="email"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
      </form>
    </AuthLayout>
  );
}
