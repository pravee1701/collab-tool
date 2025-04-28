import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/routes/ProtectedRoute";
import ApiKeys from "@/pages/apikeys/ApiKeys";
import AdminUsers from "@/pages/AdminUsers";
import VerifyEmail from "@/pages/VerifyEmail";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import SocialAuthCallback from "./pages/auth/SocialAuthCallback";
import ResendEmailVerification from "./pages/auth/ResendEmailVerification";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
          <Route path="/verify-email/:verificationToken" element={<VerifyEmail />} />
          <Route path="/auth/callback" element={<SocialAuthCallback />} />
          <Route path="/resend-email-verification" element={<ResendEmailVerification />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/api-keys" element={<ApiKeys />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/settings/change-password" element={<ChangePassword />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>

        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
