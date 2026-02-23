import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const role = session.user?.role;
    if (role !== "Moderator" && role !== "Admin") {
      return NextResponse.json(
        { message: "Only moderators and admins can approve items" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { action, rejectionReason } = await req.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    await connectDB();

    let moderatorId = session.user?._id;
    if (!moderatorId && session.user?.email) {
      const mod = await User.findOne({ email: session.user.email }).select("_id");
      moderatorId = mod?._id;
    }

    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    if (action === "approve") {
      item.approvalStatus = "Approved";
      item.approvedBy = moderatorId;
      item.approvedAt = new Date();
      item.rejectionReason = undefined;
    } else {
      item.approvalStatus = "Rejected";
      item.rejectionReason = rejectionReason || "No reason provided";
      item.approvedBy = moderatorId;
      item.approvedAt = new Date();
    }

    await item.save();

    return NextResponse.json(
      {
        message: `Item ${action === "approve" ? "approved" : "rejected"} successfully`,
        item,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving item:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
