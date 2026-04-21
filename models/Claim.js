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
    proofImageUrl: String,
    status: {
      type: String,
      // OOP: Polymorphism - status determines claim processing workflow
      enum: [
        "Pending",
        "ModeratorApproved",
        "ModeratorRejected",
        "AdminApproved",
        "AdminRejected",
      ],
      default: "Pending",
    },
    moderatorNote: String,
    moderatorBy: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - references moderator User
      ref: "User",
    },
    moderatorAt: Date,
    adminNote: String,
    adminBy: {
      type: mongoose.Schema.Types.ObjectId,
      // OOP: Association - references admin User
      ref: "User",
    },
    adminAt: Date,
  },
  { timestamps: true }
);

// OOP: Instance method - encapsulates moderator approval logic
// Centralizes state change instead of scattering across API routes
ClaimSchema.methods.approveByModerator = function (moderatorId, note) {
  this.status = "ModeratorApproved";
  this.moderatorBy = moderatorId;
  this.moderatorNote = note;
  this.moderatorAt = new Date();
};

// OOP: Instance method - encapsulates moderator rejection logic
ClaimSchema.methods.rejectByModerator = function (moderatorId, note) {
  this.status = "ModeratorRejected";
  this.moderatorBy = moderatorId;
  this.moderatorNote = note;
  this.moderatorAt = new Date();
};

// OOP: Instance method - encapsulates admin approval logic
ClaimSchema.methods.approveByAdmin = function (adminId, note) {
  this.status = "AdminApproved";
  this.adminBy = adminId;
  this.adminNote = note;
  this.adminAt = new Date();
};

// OOP: Instance method - encapsulates admin rejection logic
ClaimSchema.methods.rejectByAdmin = function (adminId, note) {
  this.status = "AdminRejected";
  this.adminBy = adminId;
  this.adminNote = note;
  this.adminAt = new Date();
};

// OOP: Abstraction - returns safe public data without sensitive info
ClaimSchema.methods.getPublicClaim = function () {
  return {
    id: this._id,
    item: this.item,
    status: this.status,
    createdAt: this.createdAt,
  };
};

// OOP: Inheritance - Claim model inherits from Mongoose Model
export default mongoose.models.Claim ||
  mongoose.model("Claim", ClaimSchema);
