import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const RegisterPage = () => {

  const { register } = useContext(AuthContext);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });

  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await register(formData);

      alert("Registration successful");

      navigate("/");

    } catch (error) {

      alert(error.response.data.message);
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 bg-gradient-to-br from-indigo-950 via-purple-900 to-blue-900">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072')",
        }}
      ></div>

      {/* GLOW EFFECTS */}
      <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 top-0 left-0"></div>

      <div className="absolute w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-20 bottom-0 right-0"></div>

      {/* REGISTER CARD */}
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

        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-200 mb-8">
          Join TeamFlow and manage smarter
        </p>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
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

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
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
        {/* PASSWORD */}
<div className="relative mb-4">

  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    onChange={handleChange}
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
      focus:ring-cyan-400
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
      hover:text-cyan-300
      transition
    "
  >
    {showPassword ? (
      <FaEyeSlash size={18}/>
    ) : (
      <FaEye size={18}/>
    )}
  </button>

</div>

        {/* ROLE */}
        <select
          name="role"
          className="
          w-full
          bg-white/20
          border
          border-white/20
          text-white
          p-3
          rounded-xl
          mb-5
          outline-none
          focus:ring-2
          focus:ring-cyan-400
        "
          onChange={handleChange}
        >
          <option value="member" className="text-black">
            Member
          </option>

          <option value="admin" className="text-black">
            Admin
          </option>
        </select>

        {/* REGISTER BUTTON */}
        <button
          className="
          w-full
          bg-gradient-to-r
          from-purple-500
          to-cyan-500
          hover:from-purple-400
          hover:to-cyan-400
          transition
          text-white
          py-3
          rounded-xl
          font-semibold
          shadow-lg
        "
        >
          Create Account
        </button>

        {/* LOGIN LINK */}
        <p className="mt-6 text-center text-gray-200">

          Already have an account?

          <Link
            to="/"
            className="text-cyan-300 ml-1 hover:text-cyan-200 transition"
          >
            Login
          </Link>

        </p>

      </form>
    </div>
  );
};

export default RegisterPage;