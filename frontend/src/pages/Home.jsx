import { AnimatePresence, motion } from "framer-motion";
import {
  Truck,
  BadgePercent,
  RefreshCw,
  Gift,
  ShoppingCart,
  Sprout,
  ChevronRight,
  Shield,
  Clock,
  Heart,
  Star,
  Leaf,
  Package,
  ChevronDown,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "./../components/Footer/Footer";
import { fetchCategories } from "../api/headerService";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/productService";
import { fetchProductImages } from "../api/productImageService";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [productImages, setProductImages] = useState({});

  const navigate = useNavigate();
  const categoryImages = {
    FRUITS:
      "https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg",
    VEGETABLES:
      "https://nutritionsource.hsph.harvard.edu/wp-content/uploads/2024/11/AdobeStock_808358973-1024x683.jpeg",
    GRAINS_PULSES:
      "https://media.istockphoto.com/id/659524906/photo/composition-with-variety-of-vegetarian-food-ingredients.jpg?s=612x612&w=0&k=20&c=AzFdpJXWAVArpzTxJxhUqCENYcYb2ozltPhYaYJAkFQ=",
    DAIRY_PRODUCTS:
      "https://d1n5l80rwxz6pi.cloudfront.net/general/blog/importance-of-dairy-products.jpg",
    MEAT_POULTRY:
      "https://poultry.mystagingwebsite.com/wp-content/uploads/2019/02/shutterstock_531404539-1024x684.jpg",
    SEAFOOD:
      "https://www.licious.in/blog/wp-content/uploads/2022/02/shutterstock_1773695441-min.jpg",
    EGGS: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSupVUjWhBfbv9lFtkEw6sQEnOh08-Yfdbgeg&s",
    HERBS_SPICES:
      "https://thumbs.dreamstime.com/b/unleash-power-nature-luscious-healthy-hair-breathtaking-panoramic-view-authentic-ayurvedic-hair-care-349764336.jpg",
    HONEY_SWEETENERS:
      "https://www.shutterstock.com/shutterstock/photos/2473679695/display_1500/stock-photo-natural-organic-honey-in-glass-jar-honey-dipper-and-honeycombs-are-near-natural-food-background-2473679695.jpg",
    NUTS_SEEDS:
      "https://assets.vogue.in/photos/5eafc3ee141f230cb35f9ad0/1:1/w_4016,h_4016,c_limit/nuts%20and%20seeds.jpg",
    BEVERAGES:
      "https://eu-images.contentstack.com/v3/assets/blt7a82e963f79cc4ec/blt60803213ffe6589c/66ec2f2d00900379f7caf243/beverages.png?width=1280&auto=webp&quality=95&format=jpg&disable=upscale",
    ORGANIC_SPECIALTY_FOODS:
      "https://img.freepik.com/premium-vector/organic-food-logo-template-design_316488-336.jpg",
    BAKERY_HOMEMADE_GOODS:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmsEIjw7iLrnto7a4W-Pbmbh8OjnupLy69Cg&s",
    OILS_CONDIMENTS:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTI8NhTQdEoPpL_ywKWuBZojFLKoOPUpOdXVQ&s",
    HANDMADE_ARTISAN_PRODUCTS:
      "https://shop.allaricerca.it/cdn/shop/articles/prodotti-artigianali-shopallaricerca.jpg?v=1707135666",
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetchProducts();
        setAllProducts(response);
      } catch (err) {
        setProductsError(err.message);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchAllProducts();
  }, []);
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();

        const categoriesWithImages = categoriesData.map((category) => {
          // Use category name as key for image mapping
          const image =
            categoryImages[category.name.toUpperCase().replace(" ", "_")] ||
            "https://via.placeholder.com/400x600.png?text=No+Image";

          return {
            ...category,
            image,
            discount: category.discount || 20, // Default discount if not provided
          };
        });

        setCategories(categoriesWithImages);
      } catch (error) {
        console.error("Error loading categories:", error);
        // Handle error state
      }
    };

    loadCategories();
    setProducts([
      {
        id: 1,
        name: "Organic Tomatoes",
        price: 2.99,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSAQBnuCIIdX38FyG9Ey2wjeGlf0pU_gx3vw&s",
      },
      {
        id: 2,
        name: "Fresh Apples",
        price: 3.49,
        image:
          "https://cdn.britannica.com/22/187222-050-07B17FB6/apples-on-a-tree-branch.jpg",
      },
      {
        id: 3,
        name: "Whole Wheat Bread",
        price: 4.99,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhvnmSPfI3Ch2ZqQsq_4f-sXkJGuOhmWe4YQ&s",
      },
      // Add more products
    ]);
  }, []);

  const heroImages = [
    "https://img.freepik.com/premium-photo/fresh-fruit-vegetable-frame-dark-background_776894-184081.jpg",
    "https://media.istockphoto.com/id/1346316025/photo/fresh-dark-red-grape-background.jpg?s=612x612&w=0&k=20&c=OBtf36ZYdogQXLgFn0OSKqzEfBoMFe1ZQvz7mC73RUA=",
    "https://static.vecteezy.com/system/resources/previews/053/521/136/non_2x/fresh-fruit-and-vegetables-exploding-in-mid-air-with-smoke-and-splashes-photo.jpeg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Get your order in 10 minutes",
    },
    {
      icon: BadgePercent,
      title: "Best Offers",
      description: "Quality products at best prices",
    },
    {
      icon: Gift,
      title: "Wide Variety",
      description: "5000+ organic products",
    },
    {
      icon: RefreshCw,
      title: "Easy Returns",
      description: "No questions asked policy",
    },
  ];

  const handleAddToCart = (productId) => {
    // Add to cart logic
  };

  useEffect(() => {
    const fetchProductImagesById = async () => {
      const imagesMap = {};

      await Promise.all(
        allProducts.map(async (product) => {
          try {
            const images = await fetchProductImages(product.id);
            imagesMap[product.id] =
              images.length > 0 ? images[0].imageUrl : null;
          } catch (error) {
            console.error(
              `Error fetching images for product ${product.id}:`,
              error
            );
            imagesMap[product.id] = null;
          }
        })
      );

      setProductImages(imagesMap);
    };

    if (allProducts.length > 0) fetchProductImagesById();
  }, [allProducts]);

  return (
    <div className="bg-slate-50">
      <Header />

      {/* Hero Carousel */}
      <motion.div className="relative h-[92vh] overflow-hidden bg-gradient-to-br from-emerald-50 to-white">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Image Container with Layered Overlay */}
            <div className="absolute inset-0 flex">
              <div className="relative h-full w-full">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-emerald-900/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent" />

                <img
                  src={img}
                  alt="Hero"
                  className="w-full h-full object-cover object-right scale-105 brightness-110 contrast-125"
                />
              </div>
            </div>

            {/* Content Container - Persistent Position */}
            <div className="absolute inset-0 flex items-center justify-start pl-16 xl:pl-24">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl space-y-8 relative z-10"
              >
                {/* Badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full inline-flex items-center gap-2 shadow-sm mb-8"
                >
                  <Sprout className="w-5 h-5 text-emerald-600" />
                  <span className="text-emerald-900 font-medium">
                    Since 2020
                  </span>
                </motion.div>

                {/* Heading */}
                <h1 className="text-6xl font-bold leading-tight text-white">
                  Fresh Organic
                  <br />
                  <span className="text-emerald-200">Marketplace</span>
                </h1>

                {/* Subtext */}
                <p className="text-xl text-emerald-100 font-light max-w-xl leading-relaxed">
                  Direct from local farms to your table - experience the
                  freshness of nature's finest produce delivered weekly
                </p>

                {/* Buttons Container - Persistent */}
                <div className="flex gap-6 mt-12">
                  <button
                    onClick={() =>
                      window.scrollTo({
                        top: window.innerHeight,
                        behavior: "smooth",
                      })
                    }
                    className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full text-lg font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
                  >
                    <ShoppingCart className="w-6 h-6" />
                    Start Shopping
                  </button>

                  <button className="px-8 py-4 border-2 border-emerald-100/30 bg-white/10 rounded-full backdrop-blur-lg text-lg font-semibold text-emerald-50 hover:bg-white/20 transition-all duration-300 flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    Meet Farmers
                  </button>
                </div>

                {/* Stats Panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-16 flex gap-12 text-emerald-100"
                >
                  <div>
                    <div className="text-4xl font-bold">15K+</div>
                    <div className="text-sm font-light">Happy Customers</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">200+</div>
                    <div className="text-sm font-light">Local Farms</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold">100%</div>
                    <div className="text-sm font-light">Organic</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Floating Image Element */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute right-24 bottom-24 w-96 h-96 rounded-full border-8 border-emerald-700 overflow-hidden shadow-2xl"
            >
              <img
                src="https://media.istockphoto.com/id/1255720611/photo/little-girl-picking-strawberry-on-a-farm-field.jpg?s=612x612&w=0&k=20&c=hJ1Z0Y5b7LQai2ZZbStVVODdm-vE80HGlaiRJJW29gM="
                alt="Fresh Produce"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        ))}
        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5,
            },
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <button
            onClick={() =>
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              })
            }
            className="p-4 rounded-full bg-white/20 backdrop-blur-sm border border-emerald-100/30 hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            aria-label="Scroll down"
          >
            <motion.div
              animate={{
                y: [0, 10, 0],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                },
              }}
            >
              <ChevronDown className="w-8 h-8 text-emerald-100" />
            </motion.div>
          </button>
        </motion.div>
      </motion.div>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-2 text-slate-800">
          <Sprout className="w-8 h-8 text-amber-600" />
          Shop by Category
        </h2>
        <motion.div
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="flex-shrink-0 w-64 h-80 relative group rounded-xl overflow-hidden shadow-lg"
              onClick={() => navigate(`/category/${category.name}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              <div className="absolute inset-0 flex items-end p-4">
                <h3 className="text-white text-xl font-semibold">
                  {category.name}
                  <ChevronRight className="w-5 h-5 ml-2 text-amber-400 inline-block transition-transform group-hover:translate-x-1" />
                </h3>
              </div>
              <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm">
                -{category.discount}%
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Weekly Special */}
      <section className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800">Weekly Specials</h2>
          <button className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center">
            View All <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100"
            >
              <div className="relative h-64">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleAddToCart(product.id)}
                  className="absolute bottom-2 right-2 bg-amber-500 p-2 rounded-full hover:bg-amber-600 transition-colors shadow-md"
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-100 text-emerald-800 text-sm px-2 py-1 rounded-full">
                    Organic
                  </span>
                  <span className="bg-amber-100 text-amber-800 text-sm px-2 py-1 rounded-full">
                    Fresh
                  </span>
                </div>
                <h3 className="font-semibold text-lg text-slate-800 mb-1">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-600 font-bold">
                    ${product.price}
                  </span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* All Products Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Leaf className="w-8 h-8 text-emerald-600" />
            Fresh From Our Farms
          </h2>
          <button
            className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center"
            onClick={() => navigate("/shop")}
          >
            View All <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        </div>

        {productsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          </div>
        ) : productsError ? (
          <div className="text-center py-12 text-red-500">{productsError}</div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            
            <AnimatePresence>
              {allProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0

                    
                   }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative h-56">
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === "IN_STOCK"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {product.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                    {productImages[product.id] ? (
                      <img
                        src={productImages[product.id]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-emerald-600 font-medium">
                        {product.category.replace(/_/g, " ")}
                      </span>
                      <div className="flex items-center text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm ml-1">4.8</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg text-slate-800 mb-2">
                      {product.name}
                    </h3>

                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <span className="text-emerald-600 font-bold text-lg">
                        ₹{product.pricePerUnit}/unit
                      </span>
                      <button
                        className="p-2 bg-emerald-100 hover:bg-emerald-200 rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add to cart logic here
                        }}
                      >
                        <ShoppingCart className="w-5 h-5 text-emerald-700" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* Features Grid */}
      <section className="bg-gradient-to-br from-slate-50 to-emerald-50 py-5">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 ${
                  [
                    "bg-emerald-500",
                    "bg-amber-500",
                    "bg-purple-500",
                    "bg-teal-500",
                  ][index % 4]
                }`}
              />
              <feature.icon
                className={`w-12 h-12 mb-4 ${
                  [
                    "text-emerald-600",
                    "text-amber-600",
                    "text-purple-600",
                    "text-teal-600",
                  ][index % 4]
                }`}
              />
              <h3 className="text-xl font-semibold mb-2 text-slate-800">
                {feature.title}
              </h3>
              <p className="text-slate-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Weekly Specials Banner */}
      <section className="container mx-auto px-4 py-8">
        <motion.div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Summer Special!</h2>
              <p className="text-lg opacity-90">
                Enjoy 25% off on all organic berries and stone fruits
              </p>
            </div>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Claim Offer
            </button>
          </div>
        </motion.div>
      </section>
      {/* Quality Assurance Section */}
      <section className="bg-slate-800 text-white py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <Shield className="w-12 h-12 mx-auto text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Quality Certified</h3>
            <p className="text-slate-300">100% organic certification</p>
          </div>
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto text-amber-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-slate-300">Within 2 hours in city limits</p>
          </div>
          <div className="text-center">
            <Heart className="w-12 h-12 mx-auto text-rose-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Satisfaction Guaranteed</h3>
            <p className="text-slate-300">30-day return policy</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
