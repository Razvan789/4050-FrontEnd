import NextAuth, { type NextAuthOptions } from "next-auth";
import { serverUrl } from "../../../utils/backendInfo.js";
import Providers from "next-auth/providers";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    // Providers.Credentials({
    //   name: "customLogin",
    //   credentials: {
    //     username: { label: "Username", type: "text", placeholder: "jsmith" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     const user = await fetch(`${serverUrl}/check-user?email`).then(res => {
    //       if (res.ok) {
    //         return res.json();
    //       }
    //       return null;
    //     }).then(data => data);
  ],
};

export default NextAuth(authOptions);
