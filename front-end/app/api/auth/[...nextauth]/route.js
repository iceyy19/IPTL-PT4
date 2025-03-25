import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/userModels";
import UserDetails from "@/models/userDetailsModel"; // Import the userDetails model

export const authOptions = {
  session: {
    strategy: "jwt", // Ensure JWT session management
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDB();
        const user = await User.findOne({
          $or: [
            { email: credentials.emailOrUsername },
            { username: credentials.emailOrUsername },
          ],
        });

        if (!user) {
          throw new Error("Invalid email/username or password");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid email/username or password");
        }

        return { id: user._id.toString(), name: user.name, email: user.email, username: user.username };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username; // Include username in the token
      }

      // Fetch userDetails and include it in the token
      if (token.username) {
        await connectToDB();
        const userDetails = await UserDetails.findOne({ username: token.username });
        if (userDetails) {
          token.bio = userDetails.bio;
          token.location = userDetails.location;
          token.birthday = userDetails.birthday;
          token.website = userDetails.website;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.username = token.username;

      // Include userDetails in the session
      session.user.bio = token.bio || "";
      session.user.location = token.location || "";
      session.user.birthday = token.birthday || null;
      session.user.website = token.website || "";

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };