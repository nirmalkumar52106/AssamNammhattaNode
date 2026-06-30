const express = require("express");
const verifyAdmin = require("../middleware/auth");
const RegistrationModel = require("../models/registration");

const router = express.Router();


router.post("/register", async (req, res) => {
  try {
   console.log("BODY:", req.body);
    const {
      fullName,
      spiritualName,
      email,
      phone,
      age,
      gender,
      city,
      state,
      country,
      center,
      attendees,
      foodPreference,
      arrivalDate,
      departureDate,
      sevaInterest,
      accommodation,
      notes
    } = req.body;

    // Required Validation

    if (
      !fullName ||
      !email ||
      !phone ||
      !city
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    const registration = await RegistrationModel.create({
      fullName,
      spiritualName,
      email,
      phone,
      age,
      gender,
      city,
      state,
      country,
      center,
      attendees,
      foodPreference,
      arrivalDate,
      departureDate,
      sevaInterest,
      accommodation,
      notes
    });

    return res.status(201).json({
      success: true,
      message: "Registration Successful",
      data: registration
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
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