import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useAuthProvider } from "../../context/authProvider";

function LoginForm() {

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const{ user, login, loading, error, userLoading} = useAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(identifier, password);
    if(!error){
          navigate("/home")
          
    }
    console.log(error)
    console.log(user)
  };

  // Redirect when logged in
  useEffect(() => {
  if(user && !userLoading){
    navigate("/home")
  }

  }, [navigate]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
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
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <p className="text-center text-sm text-gray-400">
        Don’t have an account?{" "}
        <a href="/signup" className="text-green-400 font-semibold hover:underline">
          Sign up
        </a>
      </p>
    </form>
  );
}

export default LoginForm;
