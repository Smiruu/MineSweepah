import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/authHooks"; // adjust path if needed
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const { register, loading, error, user } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    setLocalError("");
    await register(username, email, password);
  };

  // Redirect when registered
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register"}
      </button>

      {/* Show local error (e.g., password mismatch) */}
      {localError && <p className="text-red-400 text-sm text-center">{localError}</p>}

      {/* Show backend error (from API) */}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <p className="text-center text-sm text-gray-400">
        Already have an account?{" "}
        <a href="/" className="text-green-400 font-semibold hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}

export default RegisterForm;
