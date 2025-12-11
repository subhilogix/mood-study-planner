import React, { useState } from "react";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.signup(email, password);
      setSuccess("Account created! Redirecting to login...");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mind-bg dark:bg-[#131214]">
      <div className="bg-white dark:bg-[#1F1B24] p-6 rounded-xl shadow-md w-full max-w-md border dark:border-[#3A314D]">
        
        <h1 className="text-xl font-bold mb-4 text-mind-textMain dark:text-[#E6DFFF]">
          Create Account
        </h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        <form onSubmit={handleSignup} className="space-y-4">

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-mind-primary text-white p-2 rounded-xl font-semibold dark:bg-[#7A5BDB]">
            Create Account
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-mind-textSoft dark:text-[#BFAFE8]">
          Already have an account?{" "}
          <a href="/login" className="underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
