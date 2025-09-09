import { useEffect, useState } from "react";
import { Search, Trash2, RotateCcw } from "lucide-react";
import {
  fetchProducts,
  deleteProduct,
  restoreProduct,
  getProductById,
} from "../../api/productService";

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(Array.isArray(data) ? data : []);
    setCurrentPage(1); // Reset to first page
  };

  const handleSearch = async () => {
  if (!searchId) {
    loadProducts();
    return;
  }

  const product = await getProductById(searchId);
  if (product) {
    setProducts([product]);  // wrap in array as setProducts expects array
    setCurrentPage(1);
  } else {
    alert("Product not found");
    loadProducts();
  }
};


  const handleDelete = async (productId) => {
    await deleteProduct(productId);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, activeStatus: false } : p
      )
    );
  };

  const handleRestore = async (productId) => {
    await restoreProduct(productId);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, activeStatus: true } : p
      )
    );
  };

  // Pagination logic
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Products List</h2>

      {/* Search Bar */}
      <div className="mb-6 flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2 w-full max-w-md">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search by Product ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="w-full px-3 py-1 text-gray-700 bg-transparent focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-1.5 rounded-full hover:bg-green-600 transition"
        >
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white uppercase text-sm leading-normal">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="transition duration-300 ease-in-out transform hover:scale-102 hover:bg-teal-100"
                >
                  <td className="p-3">{product.id}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3">₹{product.pricePerUnit}</td>
                  <td className="p-3">{product.stockQuantity}</td>
                  <td className="p-3">{product.status}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3 flex gap-3">
                    {product.activeStatus ? (
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition flex items-center gap-1"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(product.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition flex items-center gap-1"
                      >
                        <RotateCcw size={16} /> Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {products.length > productsPerPage && (
        <div className="mt-4 flex justify-center gap-4 items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
