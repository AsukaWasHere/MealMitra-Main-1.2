import Listing from "../models/Listing.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { io, onlineUsers } from "../server.js";

/**
 * @desc    Create a new food listing
 */
export const createListing = async (req, res) => {
  try {
    const { title, description, quantity, location, price, imageUrl, quality } = req.body;
    if (!title || !quantity || !location || !price || !imageUrl) {
      return res.status(400).json({ success: false, message: "Please provide all required fields including image." });
    }
    
    if (quality && !["Best Quality", "Good Quality", "Not Consumable"].includes(quality)) {
      return res.status(400).json({ success: false, message: "Invalid quality value." });
    }
    
    const listing = await Listing.create({
      title,
      description: description || "",
      quantity,
      location,
      price,
      imageUrl,
      quality: quality || "Good Quality",
      donor: req.user.id,
    });
    res.status(201).json({ success: true, message: "Listing created successfully!", listing });
  } catch (error) {
    console.error("Error creating listing:", error);
    res.status(500).json({ success: false, message: "Server error while creating listing." });
  }
};

/**
 * @desc    Get all available food listings
 */
export const getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({ 
      quantity: { $gt: 0 } 
    }).populate("donor", "name email");
    
    res.status(200).json({ success: true, listings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/**
 * @desc    Get a single food listing by its ID
 */
export const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate("donor", "name email");
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found." });
    }
    res.status(200).json({ success: true, listing });
  } catch (error) {
    console.error("Error fetching single listing:", error);
    res.status(500).json({ success: false, message: "Server error while fetching the listing." });
  }
};

/**
 * @desc    Claim a food listing (partial or full)
 */
export const claimListing = async (req, res) => {
    try {
        const { claimQuantity } = req.body;
        const claimAmount = claimQuantity || 1;

        const listing = await Listing.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found." });
        }
        if (listing.donor.toString() === req.user.id) {
            return res.status(403).json({ success: false, message: "You cannot claim your own listing." });
        }
        if (listing.status !== "available") {
            return res.status(400).json({ success: false, message: "This listing is no longer available." });
        }
        if (claimAmount > listing.quantity) {
            return res.status(400).json({ success: false, message: `Cannot claim more than available quantity (${listing.quantity}).` });
        }
        if (claimAmount <= 0) {
            return res.status(400).json({ success: false, message: "Claim quantity must be greater than 0." });
        }

        const receiver = await User.findById(req.user.id);
        if (!receiver) {
            return res.status(404).json({ success: false, message: "Receiver not found." });
        }

        // Reduce the quantity of the food item
        listing.quantity -= claimAmount;
        
        if (listing.quantity === 0) {
            listing.status = "claimed";
            listing.receiver = req.user.id;
        }

        await listing.save();

        // UPDATED: Increase the donor's leaderboard score by the amount donated
        await User.findByIdAndUpdate(listing.donor, { 
            $inc: { donationsCount: claimAmount } 
        });
        
        const notification = await Notification.create({
            recipient: listing.donor,
            listing: listing._id,
            receiver: req.user.id,
            receiverName: receiver.name,
            receiverEmail: receiver.email,
            receiverPhone: receiver.phone || "",
            receiverAddress: receiver.address || "",
            listingTitle: listing.title,
            claimQuantity: claimAmount,
            message: `${receiver.name} has claimed ${claimAmount} ${claimAmount === 1 ? 'item' : 'items'} from your listing "${listing.title}". Contact them to arrange pickup.`
        });

        const donorSocketId = onlineUsers.get(listing.donor.toString());
        if (donorSocketId) {
            io.to(donorSocketId).emit("listingClaimed", {
                message: notification.message,
                listingId: listing._id,
                listingTitle: listing.title,
                receiverId: req.user.id,
                receiverName: receiver.name,
                receiverEmail: receiver.email,
                receiverPhone: receiver.phone || "",
                receiverAddress: receiver.address || "",
                claimQuantity: claimAmount,
                notificationId: notification._id,
            });
        }
        
        res.status(200).json({ 
            success: true, 
            message: `Successfully claimed ${claimAmount} ${claimAmount === 1 ? 'item' : 'items'}!`,
            listing 
        });
    } catch (error) {
        console.error("Error claiming listing:", error);
        res.status(500).json({ success: false, message: "Server error while claiming listing." });
    }
};

/**
 * @desc    Get user's own listings
 */
export const getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ donor: req.user.id })
      .populate("receiver", "name email phone address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, listings });
  } catch (error) {
    console.error("Error fetching user listings:", error);
    res.status(500).json({ success: false, message: "Server error while fetching listings." });
  }
};

/**
 * @desc    Delete a food listing
 */
export const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found." });
    }
    if (listing.donor.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "User not authorized to delete this listing." });
    }
    await listing.deleteOne();
    res.status(200).json({ success: true, message: "Listing deleted successfully." });
  } catch (error) {
    console.error("Error deleting listing:", error);
    res.status(500).json({ success: false, message: "Server error while deleting the listing." });
  }
};

/**
 * @desc    NEW: Get top 5 donors for the leaderboard
 */
export const getLeaderboard = async (req, res) => {
    try {
      const topDonors = await User.find({ role: "donor" })
        .sort({ donationsCount: -1 }) // Sort from highest to lowest score
        .limit(5)
        .select("name donationsCount");
  
      res.status(200).json({ success: true, leaderboard: topDonors });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching leaderboard." });
    }
};