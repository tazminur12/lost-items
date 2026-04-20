"use client";

import { SessionProvider } from "next-auth/react";

// OOP: Higher-Order Component (HOC) - wraps children with auth provider
// OOP: Abstraction - hides NextAuth setup complexity from child components
export const AuthProvider = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
