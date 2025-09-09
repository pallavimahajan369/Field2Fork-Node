import { useEffect, useState } from "react";
import { Search, Trash2, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import {
  getBuyers,
  deleteUser,
  restoreUser,
  fetchMoreBuyers,
  fetchPrevBuyers,
  getBuyerById,
} from "../../api/userService";

const BuyerTable = () => {
  const [buyers, setBuyers] = useState([]);
  const [firstBuyerId, setFirstBuyerId] = useState(null);
  const [lastBuyerId, setLastBuyerId] = useState(null);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [searchId, setSearchId] = useState("");

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const data = await getBuyers();
      if (Array.isArray(data) && data.length > 0) {
        setBuyers(data);
        setFirstBuyerId(data[0].id);
        setLastBuyerId(data[data.length - 1].id);
        setIsPrevDisabled(true);
        setIsNextDisabled(data.length < 10);
      } else {
        setBuyers([]);
        setIsPrevDisabled(true);
        setIsNextDisabled(true);
      }
    } catch (error) {
      console.error("Failed to fetch buyers:", error);
    }
  };

  const handleFetchMoreBuyers = async () => {
    if (!lastBuyerId) return;

    try {
      const newBuyers = await fetchMoreBuyers(lastBuyerId);
      if (Array.isArray(newBuyers) && newBuyers.length > 0) {
        setBuyers(newBuyers);
        setFirstBuyerId(newBuyers[0].id);
        setLastBuyerId(newBuyers[newBuyers.length - 1].id);
        setIsPrevDisabled(false);
        setIsNextDisabled(newBuyers.length < 10);
      }
    } catch (error) {
      console.error("Failed to fetch more buyers:", error);
    }
  };

  const handleFetchPrevBuyers = async () => {
    if (!firstBuyerId) return;

    try {
      const prevBuyers = await fetchPrevBuyers(firstBuyerId);
      if (Array.isArray(prevBuyers) && prevBuyers.length > 0) {
        setBuyers(prevBuyers);
        setFirstBuyerId(prevBuyers[0].id);
        setLastBuyerId(prevBuyers[prevBuyers.length - 1].id);
        setIsNextDisabled(false);
        setIsPrevDisabled(prevBuyers.length < 10);
      }
    } catch (error) {
      console.error("Failed to fetch previous buyers:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await deleteUser(id);
      setBuyers((prevBuyers) =>
        prevBuyers.map((buyer) =>
          buyer.id === id ? { ...buyer, activeStatus: false } : buyer
        )
      );
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleRestoreUser = async (id) => {
    try {
      await restoreUser(id);
      setBuyers((prevBuyers) =>
        prevBuyers.map((buyer) =>
          buyer.id === id ? { ...buyer, activeStatus: true } : buyer
        )
      );
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };
const handleSearch = async () => {
  if (!searchId) return;

  try {
    const buyer = await getBuyerById(searchId);
    console.log("Buyer from search:", buyer); // Debug log

    if (Array.isArray(buyer) && buyer.length > 0) {
      setBuyers(buyer);
      setFirstBuyerId(buyer[0].id);
      setLastBuyerId(buyer[0].id);
      setIsPrevDisabled(true);
      setIsNextDisabled(true);
    } else {
      toast.error("Buyer not found");
    }
  } catch (error) {
    console.error("Error fetching buyer by ID:", error);
    toast.error("Error fetching buyer. Check console.");
  }
};

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Buyers List</h2>

      <div className="mb-6 flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2 w-full max-w-md">
        <Search className="text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Search by Buyer ID"
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
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white uppercase text-sm leading-normal">
              <th className="border-b border-gray-200 p-3 text-left">ID</th>
              <th className="border-b border-gray-200 p-3 text-left">Username</th>
              <th className="border-b border-gray-200 p-3 text-left">Email</th>
              <th className="border-b border-gray-200 p-3 text-left">Contact</th>
              <th className="border-b border-gray-200 p-3 text-left">Address</th>
              <th className="border-b border-gray-200 p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {buyers.map((buyer) => (
              <tr
                key={buyer.id}
                className="border-b transition duration-300 ease-in-out transform hover:scale-102 hover:bg-blue-100"
              >
                <td className="border-b border-gray-200 p-3">{buyer.id}</td>
                <td className="border-b border-gray-200 p-3">{buyer.username}</td>
                <td className="border-b border-gray-200 p-3">{buyer.email}</td>
                <td className="border-b border-gray-200 p-3">{buyer.contactNumber}</td>
                <td className="border-b border-gray-200 p-3">{buyer.address || "N/A"}</td>
                <td className="border-b border-gray-200 p-3">
                  {buyer.activeStatus ? (
                    <button
                      onClick={() => handleDeleteUser(buyer.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition flex items-center gap-1"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRestoreUser(buyer.id)}
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
          onClick={handleFetchPrevBuyers}
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
          onClick={handleFetchMoreBuyers}
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

export default BuyerTable;
