import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["claim_submitted", "claim_verified", "claim_approved", "claim_rejected", "item_approved", "match_found", "system"],
      default: "system",
    },
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    relatedClaim: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Claim",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
