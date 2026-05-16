import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {

    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await login(formData);

            navigate("/dashboard");

        } catch (error) {

            alert(error.response.data.message);
        }
    };


    return (
  <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700">

    {/* BACKGROUND IMAGE */}
    <div
      className="absolute inset-0 bg-cover bg-center opacity-10"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070')",
      }}
    ></div>

    {/* GLOW EFFECT */}
    <div className="absolute w-96 h-96 bg-cyan-400 rounded-full blur-3xl opacity-20 top-10 left-10"></div>

    <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

    {/* LOGIN CARD */}
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
        TeamFlow
      </h1>

      <p className="text-center text-gray-200 mb-8">
        Welcome back to your workspace
      </p>

      {/* EMAIL */}
      <input
        type="email"
        name="email"
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
          mb-4
          outline-none
          focus:ring-2
          focus:ring-cyan-400
        "
        onChange={handleChange}
      />

      {/* PASSWORD */}
      <input
        type="password"
        name="password"
        placeholder="Enter your password"
        className="
          w-full
          bg-white/20
          border
          border-white/20
          text-white
          placeholder-gray-300
          p-3
          rounded-xl
          mb-2
          outline-none
          focus:ring-2
          focus:ring-cyan-400
        "
        onChange={handleChange}
      />

      {/* FORGOT PASSWORD */}
      <div className="flex justify-end mb-5">

        <Link
          to="/forgot-password"
          className="text-sm text-cyan-300 hover:text-cyan-200 transition"
        >
          Forgot Password?
        </Link>

      </div>

      {/* LOGIN BUTTON */}
      <button
        className="
          w-full
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          hover:from-cyan-400
          hover:to-blue-500
          transition
          text-white
          py-3
          rounded-xl
          font-semibold
          shadow-lg
        "
      >
        Login
      </button>

      {/* REGISTER */}
      <p className="mt-6 text-center text-gray-200">

        No account?

        <Link
          to="/register"
          className="text-cyan-300 ml-1 hover:text-cyan-200 transition"
        >
          Register
        </Link>

      </p>

    </form>
  </div>
);
};

export default LoginPage;