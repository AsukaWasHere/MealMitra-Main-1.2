import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./context/CartContext";

export default function Cart() {
  const { cartItems, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-green-800 text-center mb-8">
          Your Collection Cart
        </h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center">Your cart is empty.</p>
        ) : (
          <div>
            <div className="flex flex-col gap-4 mb-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div>
                    <h4 className="text-xl font-semibold text-green-700">
                      {item.title} (x{item.quantity})
                    </h4>
                    <p className="text-gray-600">
                      From: {item.donor.name}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="text-right mb-8">
              <h3 className="text-2xl font-bold text-gray-800">
                Total: ₹{getCartTotal()}
              </h3>
            </div>

            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold text-lg"
            >
              Proceed to Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}