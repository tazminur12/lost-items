import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let userId = session.user?._id;
    if (!userId && session.user?.email) {
      const u = await User.findOne({ email: session.user.email }).select("_id");
      userId = u?._id;
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let userId = session.user?._id;
    if (!userId && session.user?.email) {
      const u = await User.findOne({ email: session.user.email }).select("_id");
      userId = u?._id;
    }

    const { notificationId, markAll } = await req.json();

    if (markAll) {
      await Notification.updateMany({ user: userId, read: false }, { read: true });
      return NextResponse.json({ message: "All notifications marked as read" });
    }

    if (notificationId) {
      await Notification.findByIdAndUpdate(notificationId, { read: true });
      return NextResponse.json({ message: "Notification marked as read" });
    }

    return NextResponse.json({ message: "No action taken" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
