import AuthLayout from "@/layouts/AuthLayout";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    dispatch(login(data)).unwrap().then(() => {
      navigate("/dashboard");
    });
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...formRegister("email", { required: "Email is required" })}
          placeholder="Email"
          type="email"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <Input
          {...formRegister("password", { required: "Password is required" })}
          placeholder="Password"
          type="password"
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>

      <div className="flex items-center gap-2 my-6">
        <div className="flex-grow h-px bg-muted" />
        <span className="text-muted-foreground text-xs">OR</span>
        <div className="flex-grow h-px bg-muted" />
      </div>

      <SocialLogin />
    </AuthLayout>
  );
}
