import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// OOP: Object literal - configuration object pattern
export const authOptions = {
  providers: [
    // OOP: Strategy Pattern - swappable authentication provider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        // OOP: Static method - using class-level helper
        const user = await User.findByEmail(credentials.email);

        if (!user) {
          throw new Error("No user found with this email");
        }

        // OOP: Instance method - encapsulated password comparison logic
        const isPasswordCorrect = await user.comparePassword(credentials.password);

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        // OOP: Instance method - getPublicProfile() hides sensitive data
        const profile = user.getPublicProfile();

        // OOP: Object literal - returns user object with selected properties
        return {
          _id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          role: profile.role,
          image: profile.image,
        };
      },
    }),
  ],
  callbacks: {
    // OOP: Template Method Pattern - framework calls this lifecycle hook
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = user._id;
        token.name = user.name || user.username || token.name;
        token.role = user.role;
        token.image = user.image;
      }

      // OOP: Polymorphism - different behavior for "update" trigger
      if (trigger === "update" && session && session.user) {
        if (typeof session.user.name !== "undefined") token.name = session.user.name;
        if (typeof session.user.image !== "undefined") token.image = session.user.image;
      }

      return token;
    },
    // OOP: Template Method Pattern - session hook
    async session({ session, token }) {
      if (!session) session = {};
      if (!session.user) session.user = {};

      if (token) {
        if (typeof token._id !== "undefined") session.user._id = token._id;
        if (typeof token.role !== "undefined") session.user.role = token.role;
        if (typeof token.image !== "undefined") session.user.image = token.image;
        if (typeof token.name !== "undefined") session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
