import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordPage = () => {


  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const { data } = await API.post(
        `/auth/reset-password/${token}`,
        { password }
      );

      alert(data.message);

      navigate("/");

    } catch (error) {

      alert(error.response.data.message);
    }
  };

  return (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-900">

    {/* BACKGROUND */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070')",
      }}
    ></div>

    {/* GLOW EFFECT */}
    <div className="absolute w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20 top-0 left-0"></div>

    <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 bottom-0 right-0"></div>

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
        Reset Password
      </h1>

      <p className="text-center text-gray-200 mb-8">
        Create your new secure password
      </p>

      <div className="relative mb-5">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter new password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    className="
      w-full
      bg-white/20
      border
      border-white/20
      text-white
      placeholder-gray-300
      p-3
      rounded-xl
      pr-12
      outline-none
      focus:ring-2
      focus:ring-emerald-400
    "
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-gray-300
      hover:text-emerald-300
    "
  >
    {showPassword ? (
      <FaEyeSlash size={18}/>
    ) : (
      <FaEye size={18}/>
    )}
  </button>

</div>

      <button
        className="
          w-full
          bg-gradient-to-r
          from-emerald-500
          to-cyan-500
          hover:from-emerald-400
          hover:to-cyan-400
          transition
          text-white
          py-3
          rounded-xl
          font-semibold
          shadow-lg
        "
      >
        Reset Password
      </button>

    </form>
  </div>
);
};

export default ResetPasswordPage;