import mongoose from "mongoose";

const ClaimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
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
      enum: ["Pending", "ModeratorApproved", "ModeratorRejected", "AdminApproved", "AdminRejected"],
      default: "Pending",
    },
    moderatorNote: {
      type: String,
    },
    moderatorBy: {
      type: mongoose.Schema.Types.ObjectId,
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
      ref: "User",
    },
    adminAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Claim || mongoose.model("Claim", ClaimSchema);
