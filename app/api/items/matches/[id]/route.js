import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Item from "@/models/Item";
import { generateJSON } from "@/lib/gemini";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    await connectDB();

    const sourceItem = await Item.findById(id);
    if (!sourceItem) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    const oppositeType = sourceItem.type === "Lost" ? "Found" : "Lost";

    const candidates = await Item.find({
      type: oppositeType,
      status: { $ne: "Claimed" },
      approvalStatus: "Approved",
    })
      .select("title description category location date imageUrl aiKeywords aiSummary")
      .limit(20)
      .sort({ createdAt: -1 });

    if (candidates.length === 0) {
      return NextResponse.json({ matches: [], message: "No candidates found" });
    }

    const candidateList = candidates.map((c, i) => ({
      index: i,
      id: c._id.toString(),
      title: c.title,
      description: c.description?.slice(0, 150),
      category: c.category,
      location: c.location,
      keywords: c.aiKeywords?.join(", ") || "",
    }));

    const prompt = `You are an AI matching engine for a lost-and-found system.

A user reported a ${sourceItem.type} item:
- Title: ${sourceItem.title}
- Description: ${sourceItem.description}
- Category: ${sourceItem.category}
- Location: ${sourceItem.location}
- Keywords: ${sourceItem.aiKeywords?.join(", ") || "none"}

Below are ${oppositeType} items that might match. Score each from 0-100 based on how likely it is the same item. Consider: category, description similarity, location proximity, keywords overlap, color/brand matches.

Candidates:
${candidateList.map((c) => `[${c.index}] "${c.title}" | ${c.category} | ${c.location} | ${c.description} | keywords: ${c.keywords}`).join("\n")}

Return a JSON array of objects with fields: "index" (number), "id" (string), "score" (0-100), "reason" (short explanation why it matches or not). Only include items with score >= 30. Sort by score descending.`;

    try {
      const aiResult = await generateJSON(prompt);

      const matchesArray = Array.isArray(aiResult) ? aiResult : aiResult.matches || [];

      const enrichedMatches = matchesArray
        .filter((m) => m.score >= 30)
        .sort((a, b) => b.score - a.score)
        .map((m) => {
          const candidate = candidates.find((c) => c._id.toString() === m.id) || candidates[m.index];
          if (!candidate) return null;
          return {
            _id: candidate._id,
            title: candidate.title,
            description: candidate.description,
            category: candidate.category,
            location: candidate.location,
            date: candidate.date,
            imageUrl: candidate.imageUrl,
            score: m.score,
            reason: m.reason,
          };
        })
        .filter(Boolean);

      return NextResponse.json({ matches: enrichedMatches });
    } catch (aiErr) {
      console.error("AI matching failed:", aiErr.message);

      const keywordMatches = candidates
        .map((c) => {
          const sourceKw = (sourceItem.aiKeywords || []).map((k) => k.toLowerCase());
          const candidateKw = (c.aiKeywords || []).map((k) => k.toLowerCase());
          const overlap = sourceKw.filter((k) => candidateKw.includes(k)).length;
          const categoryMatch = sourceItem.category?.toLowerCase() === c.category?.toLowerCase() ? 20 : 0;
          const score = Math.min(100, overlap * 15 + categoryMatch);
          return {
            _id: c._id,
            title: c.title,
            description: c.description,
            category: c.category,
            location: c.location,
            date: c.date,
            imageUrl: c.imageUrl,
            score,
            reason: `${overlap} keyword(s) matched${categoryMatch ? ", same category" : ""}`,
          };
        })
        .filter((m) => m.score >= 20)
        .sort((a, b) => b.score - a.score);

      return NextResponse.json({ matches: keywordMatches, fallback: true });
    }
  } catch (error) {
    console.error("Error finding matches:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
