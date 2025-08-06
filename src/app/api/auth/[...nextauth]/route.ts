import NextAuth from "next-auth";
import { nextAuthAdapter } from "@/infrastructure/adapters/NextAuthAdapter";

const handler = NextAuth(nextAuthAdapter.getAuthOptions());

export { handler as GET, handler as POST };