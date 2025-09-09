import { motion } from "framer-motion";
import {
  Leaf,
  Users,
  Target,
  Truck,
  Handshake,
  Sprout,
  ShoppingCart,
  Shield,
  BarChart,
} from "lucide-react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useEffect, useState } from "react";

const AboutUs = () => {
  const features = [
    {
      icon: Sprout,
      title: "100% Organic",
      description: "Chemical-free farming practices",
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "Verified farm-to-table process",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Next-day delivery in metro areas",
    },
    {
      icon: BarChart,
      title: "Fair Pricing",
      description: "Direct from farmers, no middlemen",
    },
  ];

  const team = [
    {
      name: "John Farmer",
      role: "Agricultural Expert",
      img: "https://img.freepik.com/premium-photo/empowering-presence-captivating-portrait-confident-midadult-businessman-embracing-office_1000124-25261.jpg",
    },
    {
      name: "Sarah Grower",
      role: "Sustainability Lead",
      img: "https://img.freepik.com/premium-photo/passport-photo-portrait-asian-smiling-woman_264197-7635.jpg",
    },
    {
      name: "Mike Organics",
      role: "Delivery Head",
      img: "https://photos.peopleimages.com/picture/202402/3013096-man-business-entrepreneur-and-morning-bus-ride-to-the-office-for-public-transport-commute-and-travelling.-single-male-employee-and-person-in-city-transportation-for-travel-or-urban-explore-fit_400_400.jpg",
    },
  ];

  const images = [
    "https://watermark.lovepik.com/photo/20211201/large/lovepik-girl-farm-picking-vegetables-picture_501339200.jpg",
    "https://media.istockphoto.com/id/1280856062/photo/variety-of-fresh-organic-vegetables-and-fruits-in-the-garden.jpg?s=612x612&w=0&k=20&c=KoF5Ue-g3wO3vXPgLw9e2Qzf498Yow7WGXMSCNz7O60=",
    "https://cbx-prod.b-cdn.net/COLOURBOX65330353.jpg?width=800&height=800&quality=70",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white">
      <Header />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-800/90 to-emerald-700/90">
          <img
            src={images[currentImageIndex]}
            alt="Farm"
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center z-10 px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-lora">
            Cultivating Connections
          </h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto font-poppins">
            Bridging the gap between sustainable farmers and conscious consumers
          </p>
        </motion.div>
      </motion.div>

      {/* Core Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="grid md:grid-cols-4 gap-8 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="p-6 bg-white rounded-xl shadow-lg border border-emerald-100"
            >
              <feature.icon className="w-12 h-12 text-emerald-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="relative group">
              <img
                src="https://t4.ftcdn.net/jpg/05/95/55/89/360_F_595558921_z1JnF4ieH75XlWoDPuh1Os97QkPnb4dx.jpg"
                alt="Our Team"
                className="rounded-xl shadow-2xl transform group-hover:scale-105 transition-transform"
              />
              <div className="absolute -inset-4 border-2 border-emerald-200 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <motion.div className="space-y-6">
              <Leaf className="w-12 h-12 text-emerald-600" />
              <h2 className="text-4xl font-bold text-gray-800 font-lora">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed font-poppins">
                Field2Fork began as a simple idea in 2020 - to create a direct
                line between sustainable farmers and health-conscious consumers.
                What started as a local initiative has grown into a nationwide
                movement, connecting over 5,000 farms with millions of
                households.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-gradient-to-br from-teal-600 to-emerald-700 p-8 rounded-xl text-white"
          >
            <Target className="w-12 h-12 mb-6" />
            <h3 className="text-3xl font-bold mb-4 font-lora">Our Mission</h3>
            <p className="text-lg leading-relaxed">
              Empower small-scale farmers through fair trade while delivering
              fresh, organic produce to urban households within 24 hours of
              harvest.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-lg border border-emerald-100"
          >
            <Users className="w-12 h-12 mb-6 text-emerald-600" />
            <h3 className="text-3xl font-bold mb-4 font-lora">Our Vision</h3>
            <p className="text-lg leading-relaxed text-gray-600">
              To become the most trusted platform for organic food distribution
              globally while reducing food waste by 50% through smart logistics.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Offerings */}
      <section className="py-16 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 font-lora">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-poppins">
              A complete ecosystem for sustainable agriculture and conscious
              consumption
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {["Farmers", "Buyers", "Communities"].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="p-8 bg-white rounded-xl shadow-lg border border-emerald-100"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mb-6">
                  {index === 0 ? (
                    <Sprout className="w-8 h-8 text-emerald-600" />
                  ) : index === 1 ? (
                    <ShoppingCart className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <Handshake className="w-8 h-8 text-emerald-600" />
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  For {item}
                </h3>
                <ul className="space-y-3 text-gray-600">
                  {item === "Farmers" &&
                    [
                      "Direct market access",
                      "Fair pricing models",
                      "Logistics support",
                    ].map((point, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full mr-3" />
                        {point}
                      </li>
                    ))}
                  {item === "Buyers" &&
                    [
                      "Fresh organic produce",
                      "Transparent sourcing",
                      "Flexible subscriptions",
                    ].map((point, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full mr-3" />
                        {point}
                      </li>
                    ))}
                  {item === "Communities" &&
                    [
                      "Educational programs",
                      "Farm visits & workshops",
                      "Sustainability initiatives",
                    ].map((point, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-2 h-2 bg-emerald-600 rounded-full mr-3" />
                        {point}
                      </li>
                    ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8 font-lora">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-emerald-50 p-6 rounded-lg shadow-lg"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-60 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-800">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-900 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h2 className="text-4xl font-bold text-white mb-6 font-lora">
            Join the Organic Revolution
          </h2>
          <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto font-poppins">
            Whether you're a farmer, consumer, or sustainability advocate -
            there's a place for you in our community
          </p>
          <div className="flex justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="bg-white text-emerald-900 px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <Sprout className="w-5 h-5" /> For Farmers
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> For Buyers
            </motion.button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
