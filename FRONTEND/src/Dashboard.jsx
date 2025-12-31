import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";
import AuthContext from "./context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, donations, notifications

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [userRes, listingsRes, notificationsRes] = await Promise.all([
        api.get("/api/auth/me"),
        api.get("/api/listings/my-listings"),
        api.get("/api/notifications"),
      ]);

      if (userRes.data.success) setUserInfo(userRes.data.user);
      if (listingsRes.data.success) setMyListings(listingsRes.data.listings);
      if (notificationsRes.data.success) setNotifications(notificationsRes.data.notifications);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this donation? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/api/listings/${listingId}`);
      // Remove from state
      setMyListings((prev) => prev.filter((listing) => listing._id !== listingId));
      alert("Donation deleted successfully!");
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert(error.response?.data?.message || "Failed to delete donation. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome back, {userInfo?.name || "User"}!</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 p-2 flex gap-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
              activeTab === "donations"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            My Donations ({myListings.length})
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all relative ${
              activeTab === "notifications"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Notifications
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* User Info Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Your Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-lg font-semibold">{userInfo?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-lg font-semibold">{userInfo?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-lg font-semibold capitalize">{userInfo?.role || "N/A"}</p>
                </div>
                {userInfo?.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-lg font-semibold">{userInfo.phone}</p>
                  </div>
                )}
                {userInfo?.address && (
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-lg font-semibold">{userInfo.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Statistics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Total Donations Posted</span>
                  <span className="text-3xl font-bold text-green-600">{myListings.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Active Listings</span>
                  <span className="text-3xl font-bold text-emerald-600">
                    {myListings.filter((l) => l.status === "available").length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-lime-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Total Claims</span>
                  <span className="text-3xl font-bold text-lime-600">
                    {myListings.filter((l) => l.status === "claimed").length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                  <span className="text-gray-700 font-medium">Unread Notifications</span>
                  <span className="text-3xl font-bold text-yellow-600">{unreadCount}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/donate")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Post a New Donation
                </button>
                <button
                  onClick={() => navigate("/receiver-type")}
                  className="bg-gradient-to-r from-lime-500 to-green-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-lime-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-lg"
                >
                  Browse Available Donations
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === "donations" && (
          <div className="space-y-4">
            {myListings.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <p className="text-gray-600 text-lg mb-4">You haven't posted any donations yet.</p>
                <button
                  onClick={() => navigate("/donate")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all"
                >
                  Post Your First Donation
                </button>
              </div>
            ) : (
              myListings.map((listing) => (
                <div
                  key={listing._id}
                  className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {listing.imageUrl && (
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-full md:w-48 h-48 object-cover rounded-xl"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-2xl font-bold text-green-800">{listing.title}</h3>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              listing.status === "available"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {listing.status === "available" ? "Available" : "Claimed"}
                          </span>
                          <button
                            onClick={() => handleDeleteListing(listing._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
                            title="Delete donation"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-2">{listing.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Quantity</p>
                          <p className="font-semibold">{listing.quantity} servings</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="font-semibold">₹{listing.price}/serving</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-semibold text-sm">{listing.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Quality</p>
                          <p className="font-semibold">{listing.quality}</p>
                        </div>
                      </div>
                      {listing.receiver && (
                        <div className="mt-4 p-4 bg-green-50 rounded-xl">
                          <p className="text-sm font-semibold text-green-800 mb-2">Claimed by:</p>
                          <p className="text-gray-700">
                            {listing.receiver.name} ({listing.receiver.email})
                          </p>
                          {listing.receiver.phone && (
                            <p className="text-gray-600 text-sm">Phone: {listing.receiver.phone}</p>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-500 mt-4">
                        Posted on {formatDate(listing.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <p className="text-gray-600 text-lg">No notifications yet.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`bg-white rounded-2xl shadow-xl p-6 border-l-4 ${
                    notification.read
                      ? "border-gray-300 opacity-75"
                      : "border-green-500 bg-green-50/30"
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        {notification.listingTitle}
                      </h3>
                      <p className="text-gray-700 mb-4">{notification.message}</p>
                      <div className="bg-white rounded-xl p-4 mb-4">
                        <p className="font-semibold text-green-800 mb-2">Receiver Details:</p>
                        <p className="text-gray-700">
                          <strong>Name:</strong> {notification.receiverName}
                        </p>
                        <p className="text-gray-700">
                          <strong>Email:</strong> {notification.receiverEmail}
                        </p>
                        {notification.receiverPhone && (
                          <p className="text-gray-700">
                            <strong>Phone:</strong> {notification.receiverPhone}
                          </p>
                        )}
                        {notification.receiverAddress && (
                          <p className="text-gray-700">
                            <strong>Address:</strong> {notification.receiverAddress}
                          </p>
                        )}
                        <p className="text-gray-700 mt-2">
                          <strong>Claimed Quantity:</strong> {notification.claimQuantity} servings
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
