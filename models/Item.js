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
      // OOP: Polymorphism - Akne Polymorphism Behiavior 
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
      // OOP: Polymorphism - akne Polymorphism Behavior
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

// OOP: Instance method - encapsulates item approval logic
ItemSchema.methods.approveItem = function (approverId, note) {
  this.approvalStatus = "Approved";
  this.approvedBy = approverId;
  this.approvedAt = new Date();
};

// OOP: Instance method - encapsulates item rejection logic
ItemSchema.methods.rejectItem = function (approverId, reason) {
  this.approvalStatus = "Rejected";
  this.approvedBy = approverId;
  this.rejectionReason = reason;
  this.approvedAt = new Date();
};

// OOP: Instance method - marks item as resolved/claimed
ItemSchema.methods.markAsResolved = function () {
  this.status = "Resolved";
};

// OOP: Instance method - marks item as claimed
ItemSchema.methods.markAsClaimed = function () {
  this.status = "Claimed";
};

// OOP: Abstraction - returns safe public item data
ItemSchema.methods.getPublicItem = function () {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    type: this.type,
    category: this.category,
    location: this.location,
    date: this.date,
    imageUrl: this.imageUrl,
    status: this.status,
  };
};

// OOP: Inheritance - Item model inherits from Mongoose Model
export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
