const express = require("express");
const verifyAdmin = require("../middleware/auth");
const RegistrationModel = require("../models/registration");

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

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required"
      });
    }

    const options = {
      amount: 1 * 100, // Paisa
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
      key: "rzp_live_SjGJfgz1TW0u5h"
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }
});

router.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      spiritualName,
      email,
      phone,
      age,
      gender,
      village,
      city,
      pincode,
      state,
      country,
      center,
      attendees,
      foodPreference,
      arrivalDate,
      departureDate,
      sevaInterest,
      accommodation,
      notes,
    } = req.body;

    // Required Validation
    if (!fullName || !email || !phone || !city) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    const registration = await RegistrationModel.create({
      fullName,
      spiritualName,
      email,
      phone,
      age,
      gender,
      village,
      city,
      pincode,
      state,
      country,
      center,
      attendees,
      foodPreference,
      arrivalDate,
      departureDate,
      sevaInterest,
      accommodation,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      data: registration,
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

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "M1zECoibwUS7PgLYzhr30oIp") 
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      return res.json({
        success: true,
        message: "Payment Verified Successfully"
      });

    } else {

      return res.status(400).json({
        success: false,
        message: "Invalid Signature"
      });

    }

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message
    });

  }

});
// GET - All Registrations Protected
router.get("/", verifyAdmin, async (req, res) => {
  try {
    const registrations = await RegistrationModel.find({}).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// GET - Single Registration By ID Protected
router.get("/:id", verifyAdmin, async (req, res) => {
  try {
    const registration = await RegistrationModel.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// PUT - Edit Registration Protected
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedRegistration =
      await RegistrationModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    if (!updatedRegistration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration updated successfully",
      data: updatedRegistration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// DELETE - Delete Registration Protected
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedRegistration =
      await RegistrationModel.findByIdAndDelete(req.params.id);

    if (!deletedRegistration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registration deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;