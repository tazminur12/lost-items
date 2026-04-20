import mongoose from "mongoose";

// OOP: Schema class - defines the data structure like a blueprint
// OOP: Encapsulation - enforces data constraints and validation
const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - Notification references a User object
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
      // OOP: Polymorphism - different types cause different handling
      enum: ["claim_submitted", "claim_verified", "claim_approved", "claim_rejected", "item_approved", "match_found", "system"],
      default: "system",
    },
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - optional Item reference
      ref: "Item",
    },
    relatedClaim: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - optional Claim reference
      ref: "Claim",
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// OOP: Inheritance - Notification inherits Model methods (save, find, create, etc.)
export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
