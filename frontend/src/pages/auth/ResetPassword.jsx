import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { resetPassword } from "@/features/auth/authSlice";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";

export default function ResetPassword() {
  const { token } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    dispatch(resetPassword({ token, password: data.password }))
      .unwrap()
      .then(() => {
        toast.success("Password reset successfully!");
        navigate("/login");
      })
      .catch((err) => {
        toast.error(err?.message || "Something went wrong.");
      });
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          placeholder="Enter your new password"
          type="password"
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        <Button type="submit" className="w-full">
          Reset Password
        </Button>
      </form>
    </AuthLayout>
  );
}
