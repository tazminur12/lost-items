import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Claim from "@/models/Claim";
import Item from "@/models/Item";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "Admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { action, note } = await req.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await connectDB();

    let adminId = session.user?._id;
    if (!adminId && session.user?.email) {
      const u = await User.findOne({ email: session.user.email }).select("_id");
      adminId = u?._id;
    }

    const claim = await Claim.findById(id).populate("item", "title _id");
    if (!claim) {
      return NextResponse.json({ message: "Claim not found" }, { status: 404 });
    }

    claim.status = action === "approve" ? "AdminApproved" : "AdminRejected";
    claim.adminNote = note || "";
    claim.adminBy = adminId;
    claim.adminAt = new Date();
    await claim.save();

    if (action === "approve") {
      await Item.findByIdAndUpdate(claim.item._id, { status: "Claimed" });

      await Notification.create({
        user: claim.claimant,
        title: "Claim Approved!",
        message: `Your claim for "${claim.item.title}" has been approved by admin! You can now arrange to collect your item.`,
        type: "claim_approved",
        relatedItem: claim.item._id,
        relatedClaim: claim._id,
      });
    } else {
      await Notification.create({
        user: claim.claimant,
        title: "Claim Rejected by Admin",
        message: `Your claim for "${claim.item.title}" was rejected by admin. ${note ? "Reason: " + note : ""}`,
        type: "claim_rejected",
        relatedItem: claim.item._id,
        relatedClaim: claim._id,
      });
    }

    return NextResponse.json({
      message: `Claim ${action === "approve" ? "approved" : "rejected"} by admin`,
      claim,
    });
  } catch (error) {
    console.error("Error admin claim approval:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
