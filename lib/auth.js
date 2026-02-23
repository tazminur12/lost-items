import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Invalid password");
        }

        return {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          phone: user.phone,
          address: user.address,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token._id = user._id;
        token.name = user.name || user.username || token.name;
        token.role = user.role;
        token.bio = user.bio;
        token.phone = user.phone;
        token.address = user.address;
        token.image = user.image;
      }

      if (trigger === "update" && session && session.user) {
        if (typeof session.user.name !== "undefined") token.name = session.user.name;
        if (typeof session.user.image !== "undefined") token.image = session.user.image;
        if (typeof session.user.bio !== "undefined") token.bio = session.user.bio;
        if (typeof session.user.phone !== "undefined") token.phone = session.user.phone;
        if (typeof session.user.address !== "undefined") token.address = session.user.address;
      }

      return token;
    },
    async session({ session, token }) {
      if (!session) session = {};
      if (!session.user) session.user = {};

      if (token) {
        if (typeof token._id !== "undefined") session.user._id = token._id;
        if (typeof token.role !== "undefined") session.user.role = token.role;
        if (typeof token.bio !== "undefined") session.user.bio = token.bio;
        if (typeof token.phone !== "undefined") session.user.phone = token.phone;
        if (typeof token.address !== "undefined") session.user.address = token.address;
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
