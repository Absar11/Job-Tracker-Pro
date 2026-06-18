import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startAuthAction, authActionSuccess, authActionFailure } from "../redux/authSlice.js";
import { authApi } from "../services/api.js";
import { useToast } from "../components/Toast.jsx";
import { User, Mail, Lock, PlusCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [avatar, setAvatar] = useState("");

  const { loading, isAuthenticated, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast("Please pack all requested fields correctly.", "error");
      return;
    }

    if (password.length < 6) {
      toast("Security key must be at least 6 characters long.", "error");
      return;
    }

    dispatch(startAuthAction());
    try {
      const res = await authApi.register({
        name,
        email,
        password,
        role,
        avatar,
      });

      if (res.success) {
        dispatch(authActionSuccess({ user: res.user, token: res.token }));
        toast(`Welcome onboard, ${res.user.name}! Your account is active.`, "success");
        navigate("/dashboard");
      } else {
        dispatch(authActionFailure(res.message || "Failed to finalize registration."));
        toast(res.message || "Registration failed.", "error");
      }
    } catch (err) {
      dispatch(authActionFailure(err.message || "Server connector error."));
      toast(err.message || "Account creation failed.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" id="register-page-root">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl overflow-hidden p-8 lg:p-10"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Join Job Tracker Pro & take charge of your applications</p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="flex-1">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <User className="w-5 h-5" />
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Developer"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@techcompany.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
              Password (6+ characters)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 tracking-wider uppercase mb-1.5">
              Profile Photo URL (optional)
            </label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
            />
          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/10 cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-t-white border-blue-500 animate-spin" />
            ) : (
              <>
                Register Account
                <PlusCircle className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-4 border-t border-slate-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Single Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
