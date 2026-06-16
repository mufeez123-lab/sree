const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  createRazorpayOrder,
  verifyRazorpayPayment
} = require("../controllers/bookingController");

// User specific routes
router.post("/", verifyToken, createBooking);
router.get("/my-bookings", verifyToken, getUserBookings);
router.post("/razorpay-order", verifyToken, createRazorpayOrder);
router.post("/verify-payment", verifyToken, verifyRazorpayPayment);

// Admin only routes
router.get("/", verifyToken, adminMiddleware, getAllBookings);
router.put("/:id", verifyToken, adminMiddleware, updateBookingStatus);
router.delete("/:id", verifyToken, adminMiddleware, deleteBooking);

module.exports = router;
