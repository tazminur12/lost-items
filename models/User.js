import mongoose from "mongoose";

// OOP: Schema class - User data blueprint
// OOP: Encapsulation - validates and protects user data
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      maxlength: 60,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      // OOP: Encapsulation - unique constraint prevents duplicates
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    role: {
      type: String,
      // OOP: Polymorphism - role determines app behavior (User vs Admin vs Moderator)
      enum: ["User", "Admin", "Moderator"],
      default: "User",
    },
    image: {
      type: String,
    },
    bio: {
      type: String,
      maxlength: 300,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

// OOP: Inheritance - User model inherits from Mongoose Model
export default mongoose.models.User || mongoose.model("User", UserSchema);
