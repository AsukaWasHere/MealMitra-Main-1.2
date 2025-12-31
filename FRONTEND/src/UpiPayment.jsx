import React from "react"; 
import { useLocation, useNavigate } from "react-router-dom";
import ReactQRCode from "react-qr-code";
import { useCart } from "./context/CartContext";

export default function UpiPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  
  // orderDetails contains the receiver's address and the cart items
  const orderDetails = location.state || { total: 0, items: [], address: "" };
  
  const handlePaymentConfirm = () => {
  console.log("Payment Confirmed for order:", orderDetails);
  clearCart();
  // Update: Pass the order details in the state object
  navigate("/order-confirmation", { state: { order: orderDetails } });
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Scan to Complete</h1>
        <p className="text-gray-700 text-lg mb-6">
          You are confirming a collection of <span className="font-bold text-black">₹{orderDetails.total}</span>
        </p>
        
        {/* QR Code generates a standard UPI payment URI */}
        <div className="p-4 bg-white rounded-md shadow-inner inline-block border-2 border-green-100">
          <ReactQRCode 
            value={`upi://pay?pa=mealmitra@upi&pn=MealMitra&am=${orderDetails.total}&cu=INR`} 
            size={256} 
          />
        </div>
        
        <p className="text-gray-600 text-sm mt-6 mb-8 italic">
          This is a donation simulation. Click below once you have completed the pickup.
        </p>
        
        <button 
          onClick={handlePaymentConfirm} 
          className="w-full bg-emerald-600 text-white py-4 rounded-xl hover:bg-emerald-700 transition font-bold text-lg shadow-lg"
        >
          Collection Confirmed
        </button>
      </div>
    </div>
  );
}