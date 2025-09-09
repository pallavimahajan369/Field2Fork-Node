// LoginForm.js
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Mail, Lock, Github } from "lucide-react";
import { motion } from "framer-motion";
import { login } from "../../api/authService";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Updated handleLogin to use our service
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both Email and password.");
      return;
    }
    setError("");

    try {
      // Call the login service which handles the API call, session storage, and navigation
      await login(email, password);
      // Optionally, you can log the data if needed:
      // const data = await login(Email, password);
      // console.log("Logged in successfully:", data);
    } catch (err) {
      // If an error occurs, set the error message to be displayed
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-200 to-teal-500 p-6">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <motion.h1
          className="text-3xl font-bold text-center text-teal-500 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to Field2Fork
        </motion.h1>
        <h2 className="text-3xl font-semibold text-center text-teal-700">
          Login
        </h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleLogin} className="mt-6">
          <div className="relative mb-4">
            <Mail
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500"
              size={20}
            />
            <input
              type="text"
              placeholder="Email"
              value={email || ""} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 p-3 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
            />
          </div>
          <div className="relative mb-4">
            <Lock
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500"
              size={20}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 p-3 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200 shadow-md"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-gray-600">or login with</div>
        <div className="mt-4 flex gap-3">
          <button
            className="flex items-center justify-center w-1/2 p-3 border border-teal-400 rounded-lg hover:bg-teal-50 transition shadow-sm"
            aria-label="Login with Google"
          >
            <FontAwesomeIcon
              icon={faGoogle}
              className="mr-2 text-red-500"
              size="lg"
            />
            Google
          </button>
          <button
            className="flex items-center justify-center w-1/2 p-3 border border-teal-400 rounded-lg hover:bg-teal-50 transition shadow-sm"
            aria-label="Login with GitHub"
          >
            <Github size={20} className="mr-2 text-gray-800" />
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
