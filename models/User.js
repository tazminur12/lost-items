import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    role: {
      type: String,
      // Polymorphism role determines app behavior User vs Admin vs Moderator
      enum: ["User", "Admin", "Moderator"],
      default: "User",
    },
    image: String,
    bio: {
      type: String,
      maxlength: 300,
    },
    phone: String,
    address: String,
  },
  { timestamps: true }
);

// OOP: Encapsulation - password hash middleware hides hashing logic
// Runs automatically before saving document
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// OOP: Instance method - encapsulates password comparison logic
// Called on individual user instance: user.comparePassword(inputPassword)
UserSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// OOP: Abstraction - hides implementation, returns safe public profile
// Prevents exposing sensitive fields like password
UserSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    image: this.image,
  };
};

// OOP: Static method - class-level helper logic
// Called on Model directly: User.findByEmail(email)
UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email });
};

// OOP: Inheritance - User model inherits from Mongoose Model
export default mongoose.models.User || mongoose.model("User", UserSchema);
