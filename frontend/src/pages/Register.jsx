import AuthLayout from "@/layouts/AuthLayout";
import { SocialLogin } from "@/components/auth/SocialLogin";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { register as registerUser } from "@/features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Register() {
    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        dispatch(registerUser(data))
            .unwrap()
            .then(() => {
                toast.success("Registration successful!");
                navigate("/");
            })
            .catch((err) => {
                toast.error(err?.message || "Registration failed");
            });
    };

    return (
        <AuthLayout>
            <h2 className="text-2xl font-bold text-center mb-6">Create an account</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    {...formRegister("username", { required: "Name is required" })}
                    placeholder="Full Name"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

                <Input
                    {...formRegister("email", { required: "Email is required" })}
                    placeholder="Email"
                    type="email"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

                <Input
                    {...formRegister("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}
                    placeholder="Password"
                    type="password"
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}

                <Button type="submit" className="w-full">
                    Register
                </Button>
            </form>

            <div className="flex items-center gap-2 my-6">
                <div className="flex-grow h-px bg-muted" />
                <span className="text-muted-foreground text-xs">OR</span>
                <div className="flex-grow h-px bg-muted" />
            </div>
            <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-500 hover:underline">
                    Login
                </Link>
            </p>


            <SocialLogin />
        </AuthLayout>
    );
}
