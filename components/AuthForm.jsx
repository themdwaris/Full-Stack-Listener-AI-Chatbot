import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "./Loader";

const AuthForm = ({ authMode, setAuthMode, isModalOpen, onClose, setUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authMode === "register") {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/auth/register", {
          name,
          email,
          password,
        });
        if (data?.success) {
          setUser(data.user);
          toast.success(data?.message);
          setLoading(false);
          setName("");
          setEmail("");
          setPassword("");
          onClose();
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setUser(null);
        console.log("Failed to register user:", error);
      }
    } else {
      try {
        setLoading(true);
        const { data } = await axios.post("/api/auth/login", {
          email,
          password,
        });
        if (data?.success) {
          setUser(data.user);
          toast.success(data?.message);
          setLoading(false);

          setEmail("");
          setPassword("");
          onClose();
        } else {
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        setUser(null);
        console.log("Failed to login user:", error);
      }
    }
  };

  // Prevent scroll if modal is opened
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  return (
    <div
      className="w-full max-w-xl mx-auto p-4 rounded-lg bg-[var(--bg-muted)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="py-8 text-center">
        <h1 className="font-semibold text-3xl md:text-4xl">
          Sign
          <span className="text-[var(--primary)]">
            {authMode === "login" ? " in" : " up"}
          </span>
        </h1>
        <p className="text-sm py-2">Welcome to listner</p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center justify-center gap-3.5"
      >
        {authMode === "register" && (
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Name"
            className="w-full p-3 outline-none rounded-lg bg-[var(--bg-main)] border-b-2 border-b border-b-[var(--primary)]"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          name="email"
          value={email}
          placeholder="Email"
          className="w-full p-3 outline-none rounded-lg bg-[var(--bg-main)] border-b-2 border-b border-b-[var(--primary)]"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          className="w-full p-3 outline-none rounded-lg bg-[var(--bg-main)] border-b-2 border-b border-b-[var(--primary)]"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 my-6 flex items-center justify-center gap-2.5 rounded-lg bg-[var(--primary)] text-white font-semibold cursor-pointer transition transform active:scale-90"
        >
          {authMode === "login" ? "Login" : "Create"}
          {loading && <Loader className={'w-5 h-5'}/>}
        </button>
      </form>

      <div className="text-center">
        {authMode === "login" ? (
          <div className="text-sm py-2">
            Don't have an account?
            <button
              className="text-[var(--primary)] font-semibold cursor-pointer transition transform active:scale-75"
              onClick={() => setAuthMode("register")}
            >
              &nbsp;Create
            </button>
          </div>
        ) : (
          <div className="text-sm py-2">
            Aleady have an account?
            <button
              className="text-[var(--primary)] font-semibold cursor-pointer transition transform active:scale-75"
              onClick={() => setAuthMode("login")}
            >
              &nbsp;Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
