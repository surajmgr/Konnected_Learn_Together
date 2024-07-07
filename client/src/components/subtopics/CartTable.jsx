import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../utils/authContext";
import { Store } from "react-notifications-component";

const CartTable = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { currentUser, updateExistingUser } = useContext(AuthContext);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    setCartItems(cart);
  };

  const removeFromCart = (note_id) => {
    const cart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
    const newCart = cart.filter((item) => item.note_id !== note_id);
    localStorage.setItem("cart", JSON.stringify(newCart));
    setCartItems(newCart);
  };

  const purchaseNotes = async () => {
    try {
      setIsPurchasing(true);
      const cartItems = localStorage.getItem("cart")
        ? JSON.parse(localStorage.getItem("cart"))
        : [];
      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/notes/purchases`,
        {
          user_id: currentUser.id,
          noteIds: cartItems.map((item) => item.note_id),
          amount: cartItems.reduce((total, item) => total + item.amount, 0),
        }
      );
      Store.addNotification({
        title: "Success!",
        message: res.data.message,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: false,
        },
      });
      setIsPurchasing(false);
      localStorage.removeItem("cart");
      setCartItems([]);
    } catch (error) {
      Store.addNotification({
        title: "Error!",
        message: error.response.data.message,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 3000,
          onScreen: false,
        },
      });
      setIsPurchasing(false);
    }
  };

  return (
    <>
      <div className="container mx-auto my-8">
        <h2 className="text-2xl font-bold mb-6">
          Purchase Cart
          <span
            className="text-sm text-blue-500 cursor-pointer float-right"
            onClick={fetchCart}
          >
            Refresh
          </span>
        </h2>

        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Note
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Sub Topic
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Price
              </th>
              <th className="py-2 px-4 border-b border-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.note_name}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.subtopic_name}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.amount.toFixed(2)}
                  <b className="text-yellow-300"> C</b>
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  <button
                    onClick={() => removeFromCart(item.note_id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td
                className="py-2 px-4 border-b border-gray-200 text-center"
                colSpan="2"
              >
                Total
              </td>
              <td className="py-2 px-4 border-b border-gray-200">
                {cartItems
                  .reduce((total, item) => total + item.amount, 0)
                  .toFixed(2)}
                <b className="text-yellow-300"> C</b>
              </td>
              <td className="py-2 px-4 border-b border-gray-200 text-center"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="button">
        <button
          onClick={() => {
            localStorage.removeItem("cart");
            setCartItems([]);
          }}
          className="cancel bg-[#f082ac] hover:bg-[#ec5f95]"
        >
          Remove All
        </button>
        <button
          onClick={purchaseNotes}
          className="send bg-[#6f93f6] hover:bg-[#275df1]"
        >
          {isPurchasing ? "Purchasing..." : "Purchase"}
        </button>
      </div>
    </>
  );
};

export default CartTable;
