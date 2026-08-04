const mongoose = require("mongoose");

const devoteeRegistrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    spiritualName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", ""],
    },
    village: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
    },
    state: {
      type: String,
      default: "Assam",
    },
    country: {
      type: String,
      default: "India",
    },
    center: {
      type: String,
    },
    attendees: {
      type: Number,
      default: 1,
    },
    foodPreference: {
      type: String,
      default: "Prasadam (Sattvic Vegetarian)",
    },
    arrivalDate: {
      type: Date,
    },
    departureDate: {
      type: Date,
    },
    sevaInterest: {
      type: String,
      enum: ["None / Just attending", "Volunteer", "Donation", ""],
      default: "None / Just attending",
    },
    accommodation: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
    paymentAmount: {
  type: Number,
},

familyMembers: [
  {
    name: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
      default: 0,
    },

    gender: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
  },
],

paymentStatus: {
  type: String,
  enum: ["Pending", "Success", "Failed"],
  default: "Pending",
},

razorpayOrderId: {
  type: String,
},

razorpayPaymentId: {
  type: String,
},

razorpaySignature: {
  type: String,
},
  },
  { timestamps: true }
);

const RegistrationModel = mongoose.model(
  "registration",
  devoteeRegistrationSchema
);

module.exports = RegistrationModel;