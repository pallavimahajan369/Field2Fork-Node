import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Wheat,
  Sprout,
  Milk,
  Beef,
  Egg,
  Vegan,
  Lollipop,
  Nut,
  CupSoda,
  Shrub,
  Croissant,
  Amphora,
  FlaskRound,
  Fish,
  Apple,
  Salad,
} from "lucide-react";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import {
  fetchProducts,
  fetchProductsByCategories,
} from "./../api/productService";
import { fetchProductImages } from "./../api/productImageService";

const ShopByCategory = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const categoryIcons = {
    FRUITS: Apple,
    VEGETABLES: Salad,
    GRAINS_PULSES: Wheat,
    DAIRY_PRODUCTS: Milk,
    MEAT_POULTRY: Beef,
    SEAFOOD: Fish,
    EGGS: Egg,
    HERBS_SPICES: Vegan,
    HONEY_SWEETENERS: Lollipop,
    NUTS_SEEDS: Nut,
    BEVERAGES: CupSoda,
    ORGANIC_SPECIALTY_FOODS: Shrub,
    BAKERY_HOMEMADE_GOODS: Croissant,
    OILS_CONDIMENTS: FlaskRound,
    HANDMADE_ARTISAN_PRODUCTS: Amphora,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetchProductsByCategories(categoryName);
        // Fetch images for each product
        const productsWithImages = await Promise.all(
          data.map(async (product) => {
            try {
              const images = await fetchProductImages(product.id);
              return {
                ...product,
                imageUrl:
                  images.length > 0 ? images[0].imageUrl : "placeholder.jpg",
              };
            } catch (error) {
              console.error(
                `Error fetching images for product ${product.id}:`,
                error
              );
              return { ...product, imageUrl: "placeholder.jpg" };
            }
          })
        );

        setProducts(productsWithImages);

        setError(null);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);
  // useEffect(() => {
  //   const fetchProductImagesById = async () => {
  //     try {
  //       const data = await fetchProductImages(id);
  //       setProductImages(data);
  //     } catch (error) {
  //       console.error(`Error fetching images for product ${id}:`, error);
  //       imagesMap[product.id] = null;
  //     }
  //   };

  //   if (id) fetchProductImagesById();
  // }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-8"
        >
          {/* Categories Sidebar */}
          <motion.div
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="w-64 hidden lg:block"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
              <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                Categories
              </h2>
              <nav className="space-y-3">
                {Object.entries(categoryIcons).map(([category, Icon]) => (
                  <Link
                    key={category}
                    to={`/category/${category}`}
                    onClick={() => fetchProducts()}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      category === categoryName
                        ? "bg-green-100 text-green-800"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="capitalize">
                      {category.toLowerCase().replace(/_/g, " ")}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3"
            >
              {categoryIcons[categoryName] &&
                React.createElement(categoryIcons[categoryName], {
                  className: "w-8 h-8",
                })}
              {categoryName.replace(/_/g, " ")}
            </motion.h1>

            {loading ? (
              <div className="text-center py-20">Loading...</div>
            ) : error ? (
              <div className="text-center py-20 text-red-500">
                No products in this category
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <div className="p-6">
                        {/* Display Product Image */}
                        <img
                          src={product.imageUrl} // Assuming product.imageUrl contains the image URL
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-lg mb-4"
                        />
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {product.category.replace(/_/g, " ")}
                            </span>
                            {product.status === "IN_STOCK" ? (
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            ) : (
                              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="text-sm">4.8</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-500 text-sm">
                              Price:
                            </span>
                            <span className="text-lg font-bold text-gray-800">
                              ₹{product.pricePerUnit}/kg
                            </span>
                          </div>
                        </div>

                        {/* Additional Content */}
                        <div className="mt-4 text-gray-600 text-sm">
                          <p>
                            <strong>Origin:</strong> {product.origin || "India"}
                          </p>
                          <p>
                            <strong>Best Before:</strong>{" "}
                            {product.expiryDate || "6 months from purchase"}
                          </p>
                          <p>
                            <strong>Farmer:</strong>{" "}
                            {product.sellerName || "Verified Seller"}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ShopByCategory;
