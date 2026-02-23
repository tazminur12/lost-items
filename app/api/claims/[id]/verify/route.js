import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Claim from "@/models/Claim";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    const role = session?.user?.role;

    if (!session || (role !== "Moderator" && role !== "Admin")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const { action, note } = await req.json();

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }

    await connectDB();

    let modId = session.user?._id;
    if (!modId && session.user?.email) {
      const u = await User.findOne({ email: session.user.email }).select("_id");
      modId = u?._id;
    }

    const claim = await Claim.findById(id).populate("item", "title");
    if (!claim) {
      return NextResponse.json({ message: "Claim not found" }, { status: 404 });
    }

    claim.status = action === "approve" ? "ModeratorApproved" : "ModeratorRejected";
    claim.moderatorNote = note || "";
    claim.moderatorBy = modId;
    claim.moderatorAt = new Date();
    await claim.save();

    if (action === "approve") {
      await Notification.create({
        user: claim.claimant,
        title: "Claim Verified by Moderator",
        message: `Your claim for "${claim.item.title}" has been verified. Waiting for admin final approval.`,
        type: "claim_verified",
        relatedItem: claim.item._id,
        relatedClaim: claim._id,
      });
    } else {
      await Notification.create({
        user: claim.claimant,
        title: "Claim Rejected",
        message: `Your claim for "${claim.item.title}" was rejected by a moderator. ${note ? "Reason: " + note : ""}`,
        type: "claim_rejected",
        relatedItem: claim.item._id,
        relatedClaim: claim._id,
      });
    }

    return NextResponse.json({
      message: `Claim ${action === "approve" ? "verified" : "rejected"} by moderator`,
      claim,
    });
  } catch (error) {
    console.error("Error verifying claim:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
