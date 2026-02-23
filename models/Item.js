import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["Lost", "Found"],
      required: [true, "Please specify if the item is Lost or Found"],
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
    },
    location: {
      type: String,
      required: [true, "Please provide a location"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a date"],
    },
    imageUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved", "Claimed"],
      default: "Pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contactInfo: {
      type: String,
    },
    aiKeywords: {
      type: [String],
      default: [],
    },
    aiSummary: {
      type: String,
    },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
