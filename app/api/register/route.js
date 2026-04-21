import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // OOP: Static method - using class-level helper to find user
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // OOP: Constructor - creates new User instance
    // OOP: Encapsulation - password auto-hashed by pre-save middleware
    const newUser = new User({
      name,
      email,
      password, // Will be hashed automatically in UserSchema.pre("save")
      role: "User", // Default role
    });

    // OOP: Instance method - saves and triggers pre-save middleware
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while registering the user" },
      { status: 500 }
    );
  }
}
