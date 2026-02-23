import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateJSON } from "@/lib/gemini";

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

    let aiKeywords = [];
    let aiSummary = "";
    try {
      const parsed = await generateJSON(
        `Analyze this lost/found item report and return a JSON object with two fields:
1. "keywords": an array of 5-8 relevant keywords for matching (include item type, color, brand, material, location hints)
2. "summary": a concise 2-sentence summary of the item

Item Title: ${title}
Description: ${description}
Category: ${category}
Location: ${location}`
      );
      if (Array.isArray(parsed.keywords)) aiKeywords = parsed.keywords;
      if (parsed.summary) aiSummary = parsed.summary;
    } catch (aiErr) {
      console.log("AI keyword extraction skipped:", aiErr.message);
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
      aiKeywords,
      aiSummary,
    });

    await newItem.save();

    runAutoMatch(newItem, userId).catch((err) =>
      console.log("Auto-match background task error:", err.message)
    );

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

    const { searchParams } = new URL(req.url);
    const approval = searchParams.get("approval");
    const mine = searchParams.get("mine");

    let filter = {};

    if (mine === "true") {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      let userId = session.user?._id;
      if (!userId && session.user?.email) {
        const userRecord = await User.findOne({ email: session.user.email }).select("_id");
        userId = userRecord?._id;
      }
      if (userId) {
        filter.user = userId;
      }
    } else if (approval === "pending") {
      const session = await getServerSession(authOptions);
      const role = session?.user?.role;
      if (!session || (role !== "Moderator" && role !== "Admin")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }
      filter.approvalStatus = "Pending";
    } else if (approval === "rejected") {
      const session = await getServerSession(authOptions);
      const role = session?.user?.role;
      if (!session || (role !== "Moderator" && role !== "Admin")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }
      filter.approvalStatus = "Rejected";
    } else if (approval === "all") {
      const session = await getServerSession(authOptions);
      const role = session?.user?.role;
      if (!session || (role !== "Moderator" && role !== "Admin")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
      }
    } else {
      filter.approvalStatus = "Approved";
    }

    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "name email image");
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function runAutoMatch(newItem, reporterId) {
  try {
    const oppositeType = newItem.type === "Lost" ? "Found" : "Lost";

    const candidates = await Item.find({
      type: oppositeType,
      status: { $ne: "Claimed" },
      approvalStatus: "Approved",
    })
      .select("title description category location aiKeywords user")
      .limit(15)
      .sort({ createdAt: -1 });

    if (candidates.length === 0) return;

    const candidateList = candidates.map((c, i) => ({
      index: i,
      id: c._id.toString(),
      title: c.title,
      description: c.description?.slice(0, 120),
      category: c.category,
      location: c.location,
      keywords: c.aiKeywords?.join(", ") || "",
    }));

    const prompt = `You are an AI matching engine for a lost-and-found system.

A user reported a ${newItem.type} item:
- Title: ${newItem.title}
- Description: ${newItem.description}
- Category: ${newItem.category}
- Location: ${newItem.location}
- Keywords: ${newItem.aiKeywords?.join(", ") || "none"}

Below are ${oppositeType} items. Score each from 0-100 for how likely it is the same item.

Candidates:
${candidateList.map((c) => `[${c.index}] "${c.title}" | ${c.category} | ${c.location} | ${c.description} | keywords: ${c.keywords}`).join("\n")}

Return a JSON array: [{"index": number, "id": string, "score": number}]. Only include score >= 50.`;

    const aiResult = await generateJSON(prompt);
    const matches = (Array.isArray(aiResult) ? aiResult : []).filter((m) => m.score >= 50);

    if (matches.length === 0) return;

    const topMatch = matches[0];
    const matchedCandidate = candidates.find((c) => c._id.toString() === topMatch.id) || candidates[topMatch.index];
    if (!matchedCandidate) return;

    await Notification.create({
      user: reporterId,
      title: "Potential Match Found!",
      message: `We found a possible match for your ${newItem.type.toLowerCase()} item "${newItem.title}": "${matchedCandidate.title}" (${topMatch.score}% match). Check the Matches page to view details.`,
      type: "match_found",
      relatedItem: newItem._id,
    });

    if (matchedCandidate.user && matchedCandidate.user.toString() !== reporterId.toString()) {
      await Notification.create({
        user: matchedCandidate.user,
        title: "Potential Match Found!",
        message: `Someone reported a ${newItem.type.toLowerCase()} item "${newItem.title}" that may match your ${oppositeType.toLowerCase()} item "${matchedCandidate.title}" (${topMatch.score}% match).`,
        type: "match_found",
        relatedItem: matchedCandidate._id,
      });
    }
  } catch (err) {
    console.log("Auto-match error (non-critical):", err.message);
  }
}
