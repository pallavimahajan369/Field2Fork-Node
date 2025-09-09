// import React from "react";
// import bgImage from "../assets/Contact.jpg";
// import { motion } from "framer-motion";

// const ContactUs = () => {
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log("Form submitted");
//   };
//   return (
//     <div className="flex flex-col w-full">
//       <div
//         className="relative flex items-start justify-start h-[50vh] bg-cover bg-center w-full"
//         style={{
//           backgroundImage: `url(/Contactusimg/Contact.jpg)`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//           backgroundRepeat: "no-repeat",
//           width: "100vw",
//           height: "100vh",
//         }}
//       >
//         {/* Text Content on Image */}
//         <div className="relative z-10 text-white px-6 max-w-2xl text-left mt-25">
//           <h1 className="text-4xl font-bold mb-4">Do you need support?</h1>
//           <h2 className="text-4xl font-bold mb-4">
//             Our team is ready to help.
//           </h2>
//           <p className="text-lg text-gray-200">
//             We are committed to bringing you the finest, fresh produce and
//             farming essentials directly from local farms. Our goal is to offer
//             high-quality, nutritious products while supporting farmers and
//             simplifying your access to farm-fresh goods.
//           </p>
//         </div>
//       </div>

//       <div className="w-full bg-gray-100 py-16 flex justify-center">
//         <div className="max-w-7xl w-full flex bg-white p-10 rounded-lg shadow-md">
//           {/* Left Side: Text Content */}
//           <div className="w-1/2 text-left text-gray-800 p-8">
//             <h2 className="text-3xl font-bold mb-4 text-green-600">
//               Support is our main priority
//             </h2>
//             <p className="text-lg text-gray-600 mb-6">
//               "At our core, we focus on bringing fresh vegetables, fruits, and
//               all essential farming materials directly from farmers to your
//               doorstep. We’re passionate about providing high-quality, locally
//               sourced produce and supplies, ensuring that you receive the best
//               of what the land offers with convenience and care."
//             </p>
//           </div>

//           {/* Right Side: Contact Form */}
//           {/* Contact Us Section */}
//           <section className="py-16 bg-emerald-50">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               <h2 className="text-4xl font-bold text-gray-800 text-center mb-8 font-lora">
//                 Get in Touch
//               </h2>

//               {/* Contact Form */}
//               <motion.form
//                 onSubmit={handleSubmit}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="bg-white p-8 rounded-lg shadow-lg mb-12"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div>
//                     <label className="block text-gray-700 mb-2" htmlFor="name">
//                       Name
//                     </label>
//                     <input
//                       type="text"
//                       id="name"
//                       required
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-gray-700 mb-2" htmlFor="email">
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       id="email"
//                       required
//                       className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
//                     />
//                   </div>
//                 </div>
//                 <div className="mt-6">
//                   <label className="block text-gray-700 mb-2" htmlFor="message">
//                     Message
//                   </label>
//                   <textarea
//                     id="message"
//                     required
//                     rows="4"
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
//                   ></textarea>
//                 </div>
//                 <button
//                   type="submit"
//                   className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition shadow-md"
//                 >
//                   Send Message
//                 </button>
//               </motion.form>

//               {/* Google Maps */}
//               <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
//                 <iframe
//                   title="Google Map"
//                   src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.7036364028613!2d73.70045687465368!3d18.587395267130596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb000490e209%3A0x1a6d84a1e373af16!2sSanskriti%20Hospitality%20PG!5e0!3m2!1sen!2sin!4v1739111381143!5m2!1sen!2sin"
//                   width="100%"
//                   height="100%"
//                   style={{ border: 0 }}
//                   allowFullScreen=""
//                   loading="lazy"
//                 ></iframe>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContactUs;

import { motion } from "framer-motion";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const ContactUs = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="flex flex-col w-full">
      <Header />
      <div
        className="relative flex items-center justify-center h-[50vh] bg-cover bg-center w-full"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="relative z-10 text-white px-6 max-w-2xl text-center bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">Need Support?</h1>
          <h2 className="text-2xl font-semibold mb-4">
            Our Team is Ready to Help
          </h2>
          <p className="text-lg text-gray-300">
            We bring you the finest farm-fresh produce while supporting local
            farmers. Contact us for any inquiries or support.
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-50 py-16 flex justify-center">
        <div className="max-w-5xl w-full flex flex-col md:flex-row bg-white p-10 rounded-lg shadow-xl">
          <div className="w-full md:w-1/2 text-left text-gray-800 p-8">
            <h2 className="text-3xl font-bold mb-4 text-emerald-600">
              We Prioritize Your Support
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We focus on delivering fresh farm products and essential supplies
              directly to your home. Ensuring quality and convenience is our top
              priority.
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 bg-gray-100 p-8 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
              Get in Touch
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="email"
                placeholder="Email"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              <textarea
                placeholder="Message"
                required
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition"
              >
                Send Message
              </button>
            </div>
          </motion.form>
        </div>
      </div>

      <div className="w-full h-110 overflow-hidden rounded-lg shadow-lg">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.7036364028613!2d73.70045687465368!3d18.587395267130596!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bb000490e209%3A0x1a6d84a1e373af16!2sSanskriti%20Hospitality%20PG!5e0!3m2!1sen!2sin!4v1739111381143!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
