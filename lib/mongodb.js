import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env");
}

// OOP: Singleton Pattern - ensures only one connection instance exists
// OOP: Encapsulation - closure hides 'cached' as private state
let cached = global.mongoose;

if (!cached) {
  // OOP: Singleton Pattern - single global connection holder
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    // OOP: Singleton Pattern - reuse existing connection
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    // OOP: Lazy Initialization - connection created only when needed
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
