const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      default: "",
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },

    paymentVerified: {
      type: Boolean,
      default: false,
    },

    paymentMode: {
      type: String,
      enum: ["UPI", "Card", "Net Banking", "Wallet", "Cash", ""],
      default: "",
    },

    transactionId: {
      type: String,
      trim: true,
      default: "",
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation