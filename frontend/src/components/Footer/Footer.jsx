import React from "react";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Leaf,
  Users,
  Mail,
  Shield,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container"
      >
        {/* Main Footer Section */}
        <div className="bg-gray-100 py-12 px-4">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="w-8 h-8 text-emerald-600" />
                <span className="text-2xl font-bold text-black">
                  Field2fork
                </span>
              </div>
              <p className="text-gray-700">
                We offer high-quality foods and the best delivery service you
                can trust.
              </p>
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                  <Icon
                    key={index}
                    className="w-6 h-6 text-emerald-600 hover:text-teal-800 cursor-pointer"
                  />
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2 text-black">
                <Users className="w-5 h-5 text-emerald-600" /> About Us
              </h4>
              <ul className="space-y-2">
                {["About us", "Contact us", "Our team", "Careers"].map(
                  (item, index) => (
                    <li
                      key={index}
                      className="text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                      <Link to={`/${item.replace(" ", "").toLowerCase()}`}>
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Policies */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2 text-black">
                <Shield className="w-5 h-5 text-emerald-600" /> Policies
              </h4>
              <ul className="space-y-2">
                {[
                  "Privacy Policy",
                  "Terms & Conditions",
                  "Return Policy",
                  "FAQ",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="text-gray-700 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    <Link
                    //to={`/${item.replace(" ", "-").toLowerCase()}`}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2 text-black">
                <Mail className="w-5 h-5 text-emerald-600" /> Newsletter
              </h4>
              <p className="text-gray-700">
                Subscribe for updates and special offers.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="bg-gray-100 py-6 text-center text-gray-700">
          <p>© 2025 Field2fork. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map(
              (item, index) => (
                <Link
                  key={index}
                  //to={`/${item.replace(" ", "-").toLowerCase()}`}
                  className="hover:text-emerald-600 transition-colors"
                >
                  {item}
                </Link>
              )
            )}
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
