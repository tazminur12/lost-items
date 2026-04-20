import mongoose from "mongoose";

// OOP: Schema class - Item data blueprint
// OOP: Encapsulation - validates and protects item state
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
      // OOP: Polymorphism - "Lost" vs "Found" drives different workflows
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
      // OOP: Polymorphism - status affects item processing
      enum: ["Pending", "Resolved", "Claimed"],
      default: "Pending",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - Item belongs to a User
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
      // OOP: Polymorphism - approval status determines visibility
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - links to moderator/admin User
      ref: "User",
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// OOP: Inheritance - Item model inherits from Mongoose Model
export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
