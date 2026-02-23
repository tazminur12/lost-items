import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { role } = await req.json();

    if (!["User", "Admin", "Moderator"].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role. Must be User, Admin, or Moderator" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.email === session.user.email) {
      return NextResponse.json(
        { message: "You cannot change your own role" },
        { status: 400 }
      );
    }

    user.role = role;
    await user.save();

    return NextResponse.json(
      { message: `User role updated to ${role}`, user: { _id: user._id, name: user.name, email: user.email, role: user.role } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
