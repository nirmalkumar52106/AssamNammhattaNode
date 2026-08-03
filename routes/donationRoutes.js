const express = require("express");
const Donation = require("../models/donate");
const verifyAdmin = require("../middleware/auth");


const router = express.Router();


const Razorpay = require("razorpay");
const crypto = require("crypto");
const razorpay = new Razorpay({
  key_id: "rzp_live_SjGJfgz1TW0u5h",
  key_secret: "M1zECoibwUS7PgLYzhr30oIp",
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || Number(amount) < 1) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid amount",
      });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: "DON_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      key: "rzp_live_SjGJfgz1TW0u5h",
      order,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment details missing",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", "M1zECoibwUS7PgLYzhr30oIp")
      .update(
        razorpay_order_id + "|" + razorpay_payment_id
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment Verification Failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment Verified Successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
});

router.post("/", async (req, res) => {
  try {
  

const {
  name,
  phone,
  email,
  amount,
  message,
 
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
} = req.body;

    if (!name || !phone || !amount) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and amount are required",
      });
    }


    const generatedSignature = crypto.createHmac("sha256", "M1zECoibwUS7PgLYzhr30oIp")
  .update(
    razorpay_order_id + "|" + razorpay_payment_id
  )
  .digest("hex");

if (generatedSignature !== razorpay_signature) {
  return res.status(400).json({
    success: false,
    message: "Payment Verification Failed",
  });
}

 const donation = await Donation.create({
  name,
  phone,
  email,
  amount,
  message,

  paymentStatus: "verified",
  paymentVerified: true,
  paymentMode: "UPI",

  razorpayOrderId: razorpay_order_id,
  razorpayPaymentId: razorpay_payment_id,
  razorpaySignature: razorpay_signature,

  transactionId: razorpay_payment_id,

  receiptId: "DON" + Date.now(),

  verifiedAt: new Date(),
});

    res.status(201).json({
      success: true,
      message: "Donation details submitted successfully",
      data: donation,
    });
  } catch (error) {
    

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/* 
  ADMIN PROTECTED
  GET /api/donation
*/
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const donations = await Donation.find({})
      .populate("verifiedBy", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: donations.length,
      data: donations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/* 
  ADMIN PROTECTED
  GET /api/donation/:id
*/
router.get("/:id", verifyAdmin, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate(
      "verifiedBy",
      "name email"
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

/* 
  ADMIN PROTECTED
  PUT /api/donation/:id
*/
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const allowedUpdates = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      amount: req.body.amount,
      message: req.body.message,
      paymentMode: req.body.paymentMode,
      transactionId: req.body.transactionId,
    };

    Object.keys(allowedUpdates).forEach((key) => {
      if (allowedUpdates[key] === undefined) delete allowedUpdates[key];
    });

    if (allowedUpdates.amount) {
      allowedUpdates.amount = Number(allowedUpdates.amount);
    }

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Donation updated successfully",
      data: donation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


router.patch("/verify/:id", verifyAdmin, async (req, res) => {
  try {
    const { paymentStatus, paymentMode, transactionId } = req.body;

    if (!["verified", "failed", "pending"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const updateData = {
      paymentStatus,
      paymentVerified: paymentStatus === "verified",
      paymentMode: paymentMode || "",
      transactionId: transactionId || "",
      verifiedBy: req.admin?.id || null,
      verifiedAt: paymentStatus === "verified" ? new Date() : null,
    };

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Payment marked as ${paymentStatus}`,
      data: donation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});


router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: "Donation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Donation deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;