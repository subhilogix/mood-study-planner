import React, { useState } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/Input";

const LoginPage: React.FC = () => {
  const { login } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const ok = await login(email, password);

    if (!ok) {
      setError("Invalid email or password");
      return;
    }

    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center
  bg-[#F4F0FF] dark:bg-[#1F1B2E]">
      <div className="bg-white dark:bg-[#1F1B24] p-6 rounded-xl shadow-md w-full max-w-md border dark:border-[#3A314D]">
        
        <h1 className="text-xl font-bold mb-4 text-mind-textMain dark:text-[#E6DFFF]">
          Login
        </h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">

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
            Login
          </button>
        </form>

        <p className="text-sm mt-4 text-center text-mind-textSoft dark:text-[#BFAFE8]">
          No account? <a href="/signup" className="underline">Create one</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;   
