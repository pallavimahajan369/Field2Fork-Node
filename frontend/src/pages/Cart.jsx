import { useParams } from "react-router-dom";
import CartTable from "../components/CartTable";
import Header from "../components/Header/Header";
import Footer from "./../components/Footer/Footer";

const Cart = () => {
  const { id } = useParams();

  console.log("🚀 Received usrId from URL:", id);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-100 flex ">
        {id ? <CartTable cartId={id} /> : <p>Loading cart...</p>}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
