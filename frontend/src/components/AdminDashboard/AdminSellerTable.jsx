import { useEffect, useState } from "react";
import { Search, Trash2, RotateCcw } from "lucide-react";
import {
  getSellers,
  deleteUser,
  restoreUser,
  fetchMoreSellers,
  fetchPrevSellers,
  getSellerById,
} from "../../api/userService";

const SellerTable = () => {
  const [sellers, setSellers] = useState([]);
  const [firstSellerId, setFirstSellerId] = useState(null);
  const [lastSellerId, setLastSellerId] = useState(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      const data = await getSellers();
      if (Array.isArray(data) && data.length > 0) {
        setSellers(data);
        setFirstSellerId(data[0].id);
        setLastSellerId(data[data.length - 1].id);
        setIsPrevDisabled(true);
        setIsNextDisabled(data.length < 10);
      } else {
        setSellers([]);
        setIsPrevDisabled(true);
        setIsNextDisabled(true);
      }
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
    }
  };

  const handleFetchMoreSellers = async () => {
    if (!lastSellerId) return;

    try {
      const newSellers = await fetchMoreSellers(lastSellerId);
      if (Array.isArray(newSellers) && newSellers.length > 0) {
        setSellers(newSellers);
        setFirstSellerId(newSellers[0].id);
        setLastSellerId(newSellers[newSellers.length - 1].id);
        setIsPrevDisabled(false);
        setIsNextDisabled(newSellers.length < 10);
      }
    } catch (error) {
      console.error("Failed to fetch more sellers:", error);
    }
  };

  const handleFetchPrevSellers = async () => {
    if (!firstSellerId) return;

    try {
      const prevSellers = await fetchPrevSellers(firstSellerId);
      if (Array.isArray(prevSellers) && prevSellers.length > 0) {
        setSellers(prevSellers);
        setFirstSellerId(prevSellers[0].id);
        setLastSellerId(prevSellers[prevSellers.length - 1].id);
        setIsNextDisabled(false);
        setIsPrevDisabled(prevSellers.length < 10);
      }
    } catch (error) {
      console.error("Failed to fetch previous sellers:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setSellers((prev) =>
        prev.map((seller) =>
          seller.id === id ? { ...seller, activeStatus: false } : seller
        )
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRestoreUser = async (id) => {
    try {
      await restoreUser(id);
      setSellers((prev) =>
        prev.map((seller) =>
          seller.id === id ? { ...seller, activeStatus: true } : seller
        )
      );
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

  const handleSearch = async () => {
    if (!searchId) return;

    try {
      const seller = await getSellerById(searchId);
      if (Array.isArray(seller) && seller.length > 0) {
        setSellers(seller);
        setFirstSellerId(seller[0].id);
        setLastSellerId(seller[seller.length - 1].id);
        setIsPrevDisabled(true);
        setIsNextDisabled(true);
      } else {
        alert("Seller not found");
      }
    } catch (error) {
      console.error("Error fetching seller:", error);
      alert("Something went wrong. See console.");
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Sellers List</h2>

      <div className="mb-6 flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2 w-full max-w-md">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search by Seller ID"
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white uppercase text-sm leading-normal">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Contact</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Rating</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {sellers.map((seller) => (
              <tr
                key={seller.id}
                className="transition duration-300 ease-in-out transform hover:scale-102 hover:bg-teal-100"
              >
                <td className="p-3">{seller.id}</td>
                <td className="p-3">{seller.username}</td>
                <td className="p-3">{seller.email}</td>
                <td className="p-3">{seller.contactNumber}</td>
                <td className="p-3">{seller.location || "N/A"}</td>
                <td className="p-3">{seller.rating} ⭐</td>
                <td className="p-3">
                  {seller.activeStatus ? (
                    <button
                      onClick={() => handleDeleteUser(seller.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRestoreUser(seller.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 transition flex items-center gap-1"
                    >
                      <RotateCcw size={16} />
                      Restore
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handleFetchPrevSellers}
          disabled={isPrevDisabled}
          className={`px-4 py-2 rounded ${
            isPrevDisabled
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Prev
        </button>
        <button
          onClick={handleFetchMoreSellers}
          disabled={isNextDisabled}
          className={`px-4 py-2 rounded ${
            isNextDisabled
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SellerTable;
