import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Claim from "@/models/Claim";
import Item from "@/models/Item";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { itemId, identifyingFeatures, proofImageUrl } = await req.json();

    if (!itemId || !identifyingFeatures) {
      return NextResponse.json(
        { message: "Item ID and identifying features are required" },
        { status: 400 }
      );
    }

    await connectDB();

    let userId = session.user?._id;
    if (!userId && session.user?.email) {
      const u = await User.findOne({ email: session.user.email }).select("_id");
      userId = u?._id;
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const existingClaim = await Claim.findOne({ item: itemId, claimant: userId });
    if (existingClaim) {
      return NextResponse.json(
        { message: "You have already submitted a claim for this item" },
        { status: 400 }
      );
    }

    // OOP: Constructor - creates new Claim instance using Model class
    const claim = new Claim({
      item: itemId,
      claimant: userId,
      identifyingFeatures,
      proofImageUrl: proofImageUrl || undefined,
    });

    await claim.save();

    // OOP: Factory method - Notification.create() creates and saves notification
    await Notification.create({
      user: item.user,
      title: "New Claim on Your Item",
      message: `Someone has submitted a claim for "${item.title}". A moderator will review it shortly.`,
      type: "claim_submitted",
      relatedItem: item._id,
      relatedClaim: claim._id,
    });

    return NextResponse.json(
      { message: "Claim submitted successfully. A moderator will review it.", claim },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting claim:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const role = session.user?.role;

    let filter = {};

    if (role === "Moderator" || role === "Admin") {
      if (status && status !== "all") {
        filter.status = status;
      }
    } else {
      let userId = session.user?._id;
      if (!userId && session.user?.email) {
        const u = await User.findOne({ email: session.user.email }).select("_id");
        userId = u?._id;
      }
      filter.claimant = userId;
    }

    const claims = await Claim.find(filter)
      .sort({ createdAt: -1 })
      .populate("item", "title description type category location date imageUrl status")
      .populate("claimant", "name email image")
      .populate("moderatorBy", "name email")
      .populate("adminBy", "name email");

    return NextResponse.json(claims, { status: 200 });
  } catch (error) {
    console.error("Error fetching claims:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
