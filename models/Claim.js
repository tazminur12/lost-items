import mongoose from "mongoose";

// OOP: Schema class - Claim data blueprint
// OOP: Encapsulation - validates and protects claim state
const ClaimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - Claim references an Item
      ref: "Item",
      required: true,
    },
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - Claim references the User making the claim
      ref: "User",
      required: true,
    },
    identifyingFeatures: {
      type: String,
      required: [true, "Please describe identifying features"],
    },
    proofImageUrl: {
      type: String,
    },
    status: {
      type: String,
      // OOP: Polymorphism - status determines claim processing workflow
      enum: ["Pending", "ModeratorApproved", "ModeratorRejected", "AdminApproved", "AdminRejected"],
      default: "Pending",
    },
    moderatorNote: {
      type: String,
    },
    moderatorBy: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - references moderator User
      ref: "User",
    },
    moderatorAt: {
      type: Date,
    },
    adminNote: {
      type: String,
    },
    adminBy: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - references admin User
      ref: "User",
    },
    adminAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// OOP: Inheritance - Claim model inherits from Mongoose Model
export default mongoose.models.Claim || mongoose.model("Claim", ClaimSchema);
