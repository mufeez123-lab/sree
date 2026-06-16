const db = require("../config/db");

// 1. Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out, adults, children, user_id: bodyUserId, payment_method } = req.body;
    let user_id = req.user.id;

    if (req.user.role === "admin" && bodyUserId) {
      user_id = bodyUserId;
    }

    if (!room_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Room ID, Check-in, and Check-out dates are required."
      });
    }

    // Fetch room price to compute or verify price
    const [rooms] = await db.query("SELECT price FROM rooms WHERE id = ?", [room_id]);
    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found."
      });
    }
    const roomPrice = parseFloat(rooms[0].price);

    // Calculate nights
    const start = new Date(check_in);
    const end = new Date(check_out);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid Check-in or Check-out date format."
      });
    }

    const differenceInTime = end.getTime() - start.getTime();
    if (differenceInTime <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after Check-in date."
      });
    }
    const nights = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    const total_price = nights * roomPrice;

    const [result] = await db.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out, adults, children, total_price, status, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [user_id, room_id, check_in, check_out, adults || 1, children || 0, total_price, payment_method || 'online']
    );

    // Fetch details for email notification
    try {
      const [bookingRows] = await db.query(
        `SELECT b.*, r.name as room_name, u.full_name as guest_name, u.email as guest_email
         FROM bookings b
         JOIN rooms r ON b.room_id = r.id
         JOIN users u ON b.user_id = u.id
         WHERE b.id = ?`,
        [result.insertId]
      );
      if (bookingRows.length > 0) {
        const { sendBookingCreatedEmail } = require("../utils/email");
        sendBookingCreatedEmail(bookingRows[0]).catch(err => {
          console.error("[Email Error] Failed to send booking created email:", err);
        });
      }
    } catch (err) {
      console.error("[Email] Failed to fetch booking details for creation notification:", err);
    }

    res.status(201).json({
      success: true,
      message: "Booking request submitted successfully.",
      bookingId: result.insertId,
      total_price
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Booking submission failed."
    });
  }
};

// 2. Fetch logged-in user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const [bookings] = await db.query(
      `SELECT b.*, r.name as room_name, r.image as room_image, r.price as room_price
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       WHERE b.user_id = ?
       ORDER BY b.id DESC`,
      [user_id]
    );

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings."
    });
  }
};

// 3. Fetch all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(
      `SELECT b.*, r.name as room_name, u.full_name as guest_name, u.email as guest_email, u.phone as guest_phone
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.id DESC`
    );

    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all bookings."
    });
  }
};

// 4. Update booking status or details (Admin only)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, payment_method } = req.body;
    const { id } = req.params;

    let updateFields = [];
    let queryParams = [];

    if (status !== undefined) {
      const validStatuses = ['pending', 'confirmed', 'checked_in', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        });
      }
      updateFields.push("status = ?");
      queryParams.push(status);
    }

    if (payment_method !== undefined) {
      const validMethods = ['cash', 'online'];
      if (!validMethods.includes(payment_method)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment method. Must be one of: ${validMethods.join(", ")}`
        });
      }
      updateFields.push("payment_method = ?");
      queryParams.push(payment_method);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update."
      });
    }

    queryParams.push(id);

    const [result] = await db.query(
      `UPDATE bookings SET ${updateFields.join(", ")} WHERE id = ?`,
      queryParams
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    // Fetch details for email notification
    try {
      const [bookingRows] = await db.query(
        `SELECT b.*, r.name as room_name, u.full_name as guest_name, u.email as guest_email
         FROM bookings b
         JOIN rooms r ON b.room_id = r.id
         JOIN users u ON b.user_id = u.id
         WHERE b.id = ?`,
        [id]
      );
      if (bookingRows.length > 0) {
        const { sendBookingUpdatedEmail } = require("../utils/email");
        sendBookingUpdatedEmail(bookingRows[0]).catch(err => {
          console.error("[Email Error] Failed to send booking updated email:", err);
        });
      }
    } catch (err) {
      console.error("[Email] Failed to fetch booking details for update notification:", err);
    }

    res.json({
      success: true,
      message: "Booking updated successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking."
    });
  }
};

// 5. Delete booking (Admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch details before deleting
    const [bookingRows] = await db.query(
      `SELECT b.*, r.name as room_name, u.full_name as guest_name, u.email as guest_email
       FROM bookings b
       JOIN rooms r ON b.room_id = r.id
       JOIN users u ON b.user_id = u.id
       WHERE b.id = ?`,
      [id]
    );

    if (bookingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found."
      });
    }

    await db.query("DELETE FROM bookings WHERE id = ?", [id]);

    // Send cancel notification email in background
    const { sendBookingDeletedEmail } = require("../utils/email");
    sendBookingDeletedEmail(bookingRows[0]).catch(err => {
      console.error("[Email Error] Failed to send booking deleted email:", err);
    });

    res.json({
      success: true,
      message: "Booking deleted successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking."
    });
  }
};

// 6. Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { room_id, check_in, check_out } = req.body;
    if (!room_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Room ID, Check-in, and Check-out dates are required."
      });
    }

    // Fetch room price
    const [rooms] = await db.query("SELECT price FROM rooms WHERE id = ?", [room_id]);
    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found."
      });
    }
    const roomPrice = parseFloat(rooms[0].price);

    // Calculate nights
    const start = new Date(check_in);
    const end = new Date(check_out);
    const differenceInTime = end.getTime() - start.getTime();
    if (differenceInTime <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after Check-in date."
      });
    }
    const nights = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    const total_price = nights * roomPrice;

    const Razorpay = require("razorpay");
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_mockkeyid12";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mocksecret12";

    const razorpay = new Razorpay({
      key_id,
      key_secret
    });

    const options = {
      amount: Math.round(total_price * 100), // amount in paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id
    });
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Failed to initiate online payment order."
    });
  }
};

// 7. Verify Razorpay Payment and create Booking
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      room_id,
      check_in,
      check_out,
      adults,
      children
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !room_id || !check_in || !check_out) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters or booking details."
      });
    }

    const crypto = require("crypto");
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_mocksecret12";
    
    // Verify signature
    const hmac = crypto.createHmac("sha256", key_secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed. Invalid transaction."
      });
    }

    const user_id = req.user.id;

    // Fetch room price to compute price
    const [rooms] = await db.query("SELECT price FROM rooms WHERE id = ?", [room_id]);
    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Room not found."
      });
    }
    const roomPrice = parseFloat(rooms[0].price);

    // Calculate nights
    const start = new Date(check_in);
    const end = new Date(check_out);
    const differenceInTime = end.getTime() - start.getTime();
    const nights = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    const total_price = nights * roomPrice;

    const [result] = await db.query(
      `INSERT INTO bookings (user_id, room_id, check_in, check_out, adults, children, total_price, status, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed', 'online')`,
      [user_id, room_id, check_in, check_out, adults || 1, children || 0, total_price]
    );

    // Fetch details for email notification (confirmed online)
    try {
      const [bookingRows] = await db.query(
        `SELECT b.*, r.name as room_name, u.full_name as guest_name, u.email as guest_email
         FROM bookings b
         JOIN rooms r ON b.room_id = r.id
         JOIN users u ON b.user_id = u.id
         WHERE b.id = ?`,
        [result.insertId]
      );
      if (bookingRows.length > 0) {
        const { sendBookingUpdatedEmail } = require("../utils/email");
        sendBookingUpdatedEmail(bookingRows[0]).catch(err => {
          console.error("[Email Error] Failed to send booking confirmed email:", err);
        });
      }
    } catch (err) {
      console.error("[Email] Failed to fetch booking details for confirmation notification:", err);
    }

    res.status(201).json({
      success: true,
      message: "Online payment verified and booking confirmed successfully.",
      bookingId: result.insertId,
      total_price
    });
  } catch (error) {
    console.error("Payment verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed."
    });
  }
};
