import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/productService";
import { fetchProductImages } from "../api/productImageService";
import Header from "../components/Header/Header";// ✅ Import Header

const Shop = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [productImages, setProductImages] = useState({});
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const products = await fetchProducts();
        setAllProducts(products);
      } catch (err) {
        setProductsError(err.message);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Fetch product images
  useEffect(() => {
    const fetchImages = async () => {
      const imageMap = {};
      await Promise.all(
        allProducts.map(async (product) => {
          try {
            const images = await fetchProductImages(product.id);
            imageMap[product.id] = images.length > 0 ? images[0].imageUrl : null;
          } catch {
            imageMap[product.id] = null;
          }
        })
      );
      setProductImages(imageMap);
    };

    if (allProducts.length > 0) fetchImages();
  }, [allProducts]);

  return (
    <>
      <Header /> {/* ✅ Add Header here */}

      <div className="bg-slate-50 min-h-screen py-16 px-4 container mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">
          All Products
        </h1>

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
                  exit={{ opacity: 0 }}
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
      </div>
    </>
  );
};

export default Shop;
