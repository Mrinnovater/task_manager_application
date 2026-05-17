import { useState } from "react";
import API from "../../api/axios";

const ForgotPasswordPage = () => {

  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setErrorMsg("");
      setMessage("");

      const { data } = await API.post(
        "/auth/forgot-password",
        { email }
      );

      setMessage(data.message);

      // 30 sec cooldown
      setCooldown(30);

      const timer = setInterval(() => {

        setCooldown((prev) => {

          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }

          return prev - 1;

        });

      }, 1000);

    } catch (error) {

      setMessage("");

      setErrorMsg(
        error?.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-gradient-to-br from-slate-950 via-cyan-900 to-blue-900">

      {/* BACKGROUND */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')",
        }}
      ></div>

      {/* GLOW EFFECT */}
      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 top-0 right-0"></div>

      <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 bottom-0 left-0"></div>

      {/* CARD */}
      <form
        onSubmit={handleSubmit}
        className="
        relative
        z-10
        backdrop-blur-xl
        bg-white/10
        border
        border-white/20
        shadow-2xl
        rounded-3xl
        p-8
        w-full
        max-w-md
      "
      >

        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-center text-gray-200 mb-8">
          Enter your email to receive reset link
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="
  w-full
  bg-white/20
  border
  border-white/20
  text-white
  placeholder-gray-300
  p-3
  rounded-xl
  mb-5
  outline-none
  focus:ring-2
  focus:ring-cyan-400
"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* SUCCESS MESSAGE */}
        {message && (
          <div className="
    mb-4
    bg-green-500/20
    border
    border-green-400
    text-green-200
    px-4
    py-3
    rounded-xl
    backdrop-blur-md
  ">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="
    mb-4
    bg-red-500/20
    border
    border-red-400
    text-red-200
    px-4
    py-3
    rounded-xl
    backdrop-blur-md
  ">
            {errorMsg}
          </div>
        )}

        <button
          disabled={cooldown > 0}
          className={`
    w-full
    py-3
    rounded-xl
    font-semibold
    shadow-lg
    transition-all
    duration-300
    ${cooldown > 0
              ? "bg-gray-400 cursor-not-allowed text-white"
              : `
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          hover:from-cyan-400
          hover:to-blue-500
          hover:scale-[1.02]
          text-white
        `
            }
  `}
        >
          {cooldown > 0
            ? `Wait ${cooldown}s`
            : "Send Reset Link"}
        </button>

      </form>
    </div>
  );
};

export default ForgotPasswordPage;