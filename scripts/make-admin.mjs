import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://lost_items:8qvj46hugbhzuGoG@tazminur.vey191o.mongodb.net/lost-items?appName=tazminur";

const email = process.argv[2];

if (!email) {
  console.error("\n  Usage: node scripts/make-admin.mjs <email>\n");
  console.error("  Example: node scripts/make-admin.mjs admin@example.com\n");
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB\n");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Show all users first
    const allUsers = await usersCollection.find({}, { projection: { name: 1, email: 1, role: 1 } }).toArray();
    console.log("All users in database:");
    console.log("─".repeat(60));
    if (allUsers.length === 0) {
      console.log("  (No users found - please register first)");
    } else {
      allUsers.forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.name} | ${u.email} | Role: ${u.role || "User"}`);
      });
    }
    console.log("─".repeat(60));

    // Update the specified user
    const result = await usersCollection.updateOne(
      { email: email },
      { $set: { role: "Admin" } }
    );

    if (result.matchedCount === 0) {
      console.log(`\n  No user found with email: ${email}`);
      console.log("  Please check the email and try again.\n");
    } else {
      console.log(`\n  ✓ Successfully updated ${email} to Admin role!`);
      console.log("  Please log out and log back in for changes to take effect.\n");
    }
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
