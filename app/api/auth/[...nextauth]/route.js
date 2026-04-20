import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// OOP (OO-pattern): Factory function (NextAuth builds a handler using configured options)
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
