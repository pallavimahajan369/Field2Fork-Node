import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Mail, User, Phone, MapPin, Github, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { registerBuyer } from "./../../api/userService";

const Buyer_SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contactNumber: "",
    address: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!Object.values(formData).every((value) => value.trim())) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      await registerBuyer(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-emerald-500 p-6">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <motion.h1
          className="text-3xl font-bold text-center text-emerald-500 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Join Field2Fork
        </motion.h1>
        <h2 className="text-2xl font-semibold text-center text-emerald-700">
          Buyer SignUp
        </h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleRegister} className="mt-6">
          <div className="relative mb-4">
            <User
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500"
              size={20}
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-12 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            />
          </div>
          <div className="relative mb-4">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500"
              size={20}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            />
          </div>
          <div className="relative mb-4">
            <Phone
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500"
              size={20}
            />
            <input
              type="tel"
              name="contactNumber"
              placeholder="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange}
              className="w-full pl-12 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            />
          </div>
          <div className="relative mb-4">
            <MapPin
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500"
              size={20}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-12 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            />
          </div>
          <div className="relative mb-4">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500"
              size={20}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 p-3 border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-200 shadow-md"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600">or sign up with</div>
        <div className="mt-4 flex gap-3">
          <button
            className="flex items-center justify-center w-1/2 p-3 border border-emerald-400 rounded-lg hover:bg-emerald-50 transition shadow-sm"
            aria-label="Sign up with Google"
          >
            <FontAwesomeIcon
              icon={faGoogle}
              className="mr-2 text-red-500"
              size="lg"
            />
            Google
          </button>
          <button
            className="flex items-center justify-center w-1/2 p-3 border border-emerald-400 rounded-lg hover:bg-emerald-50 transition shadow-sm"
            aria-label="Sign up with GitHub"
          >
            <Github size={20} className="mr-2 text-gray-800" />
            GitHub
          </button>
        </div>
        <div className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Buyer_SignUp;
