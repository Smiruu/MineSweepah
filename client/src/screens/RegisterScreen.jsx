import React from "react";
import RegisterForm from "../components/AuthScreens/RegisterForm";

function RegisterScreen() {
  return (
    <div className="w-full max-w-md bg-slate-900/80 border border-emerald-400/40 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.25)] backdrop-blur p-8">
      <h1 className="text-2xl font-extrabold text-emerald-300 text-center mb-2">
        💣 MineSweepah
      </h1>
      <p className="text-emerald-200/80 text-center text-sm mb-8">
        Welcome, Commander. Create your account to join the mission.
      </p>
      <RegisterForm />
    </div>
  );
}

export default RegisterScreen;
