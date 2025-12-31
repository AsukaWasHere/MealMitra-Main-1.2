import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Home";
import About from "./About";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Userchoice from "./Userchoice";
import Getchoice from "./Getchoice";
import Donate from "./Donate";
import Cart from "./Cart";
import Checkout from "./Checkout";
import UpiPayment from "./UpiPayment";
import OrderConfirmation from "./OrderConfirmation";
import ProtectedRoute from "./components/ProtectedRoute";
import ReceiverTypeChoice from "./ReceiverTypeChoice";
import Receiveresults from "./Receiveresults"; 
import Chatbot from "./components/Chatbot"; // <--- ADD THIS LINE (Step 1)

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/userchoice" element={<Userchoice />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/getchoice" element={<ProtectedRoute><Getchoice /></ProtectedRoute>} />
            <Route path="/donate" element={<ProtectedRoute><Donate /></ProtectedRoute>} />
            <Route path="/receiver-type" element={<ProtectedRoute><ReceiverTypeChoice /></ProtectedRoute>} />
            <Route path="/receiveresults" element={<ProtectedRoute><Receiveresults /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/upi-payment" element={<ProtectedRoute><UpiPayment /></ProtectedRoute>} />
            <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
          </Routes>
        </main>

        {/* <--- ADD THIS LINE HERE (Step 2) ---> */}
        {/* This makes the chatbot show up on every page! */}
        <Chatbot /> 

        <Footer />
      </div>
    </Router>
  );
}

export default App;