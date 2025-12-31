import { useNavigate } from "react-router-dom";

export default function Getchoice() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 relative overflow-hidden p-6">
      {/* Decorative blurred blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-200 rounded-full filter blur-3xl opacity-40"></div>

      {/* Content container */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl relative z-10">
        {/* Donate box */}
        <div
          onClick={() => navigate("/donate")}
          className="cursor-pointer bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center hover:scale-105 transform transition"
        >
          <img
            src="pic1.png"
            alt="Donate"
            className="w-24 h-24 mb-4"
          />
          <h2 className="text-2xl font-bold text-green-800 mb-4">Donate</h2>
          <p className="text-gray-700 text-center">
            Share your food with those in need.
          </p>
        </div>

        {/* Receive box - Updated onClick handler */}
        <div
          onClick={() => navigate("/receiver-type")}
          className="cursor-pointer bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center hover:scale-105 transform transition"
        >
          <img 
            src="pic33.png"
            alt="Receive"
            className="w-24 h-24 mb-4"
          />
          <h2 className="text-2xl font-bold text-green-800 mb-4">Receive</h2>
          <p className="text-gray-700 text-center">
            Request food donations for yourself or your organization.
          </p>
        </div>
      </div>
    </div>
  );
}