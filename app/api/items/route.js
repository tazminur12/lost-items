import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { GET as authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {
      title,
      description,
      type,
      category,
      location,
      date,
      imageUrl,
      contactInfo,
    } = await req.json();

    if (!title || !description || !type || !category || !location || !date) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Resolve user id: sometimes session.user._id may not be present on server session
    let userId = session.user?._id;
    if (!userId && session.user?.email) {
      const userRecord = await User.findOne({ email: session.user.email }).select("_id");
      userId = userRecord?._id;
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized or user not found" }, { status: 401 });
    }

    const newItem = new Item({
      title,
      description,
      type,
      category,
      location,
      date,
      imageUrl,
      contactInfo,
      user: userId,
    });

    await newItem.save();

    return NextResponse.json(
      { message: "Item reported successfully", item: newItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const items = await Item.find().sort({ createdAt: -1 }).populate("user", "name email");
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
