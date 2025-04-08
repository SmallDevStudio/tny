import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmail } from "@/services/firebase";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import generateId from "@/services/generateId";
import UAParser from "ua-parser-js";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmail(
            credentials.email,
            credentials.password
          );
          if (!userCredential) throw new Error("Invalid credentials");

          const user = userCredential.user;
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName || "",
          };
        } catch (error) {
          throw new Error(error.message || "Invalid credentials");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/error",
    signOut: "/",
    signup: "/register",
  },
  callbacks: {
    async signIn({ user, account }) {
      const userRef = doc(db, "users", account.providerAccountId);
      const userSnap = await getDoc(userRef);
      const newUserId = await generateId();

      // 🔍 ดึงข้อมูล IP และ User-Agent
      let ip = "unknown";
      let deviceInfo = {
        browser: "unknown",
        os: "unknown",
        device: "desktop",
      };

      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        ip = ipData.ip;

        const parser = new UAParser();
        const result = parser.getResult();
        deviceInfo = {
          browser: result.browser.name || "unknown",
          os: result.os.name || "unknown",
          device: result.device.type || "desktop",
        };
      } catch (err) {
        console.error("Error getting IP/Device info:", err);
      }

      const userData = {
        uid: account.providerAccountId,
        userId: newUserId,
        googleId: account.providerAccountId,
        email: user.email,
        name: user.name,
        image: user.image,
        role: "user",
        authProvider: "google",
        last_login: Date.now(),
        createdAt: Date.now(),
        ip,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        device: deviceInfo.device,
      };

      if (!userSnap.exists()) {
        await setDoc(userRef, userData);
      } else {
        await updateDoc(userRef, {
          last_login: Date.now(),
          ip,
          browser: deviceInfo.browser,
          os: deviceInfo.os,
          device: deviceInfo.device,
        });
      }

      return true;
    },

    async jwt({ token, trigger, user, account }) {
      if (user) {
        token.id = user.id;
        token.user = user;
        token.account = account;
      }

      try {
        const userRef = doc(db, "users", token.id);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          token.user = {
            ...userDoc.data(),
            id: token.id,
            account: token.account,
          };
        }
      } catch (error) {
        console.error("JWT update error:", error);
      }

      if (trigger === "update" && user) {
        try {
          const userRef = doc(db, "users", token.id);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            token.user = {
              ...userDoc.data(),
              id: token.id,
              account: token.account,
            };
          }
        } catch (error) {
          console.error("JWT update error:", error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      const userRef = doc(db, "users", token.sub);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        session.user = userSnap.data(); // ✅ ดึงข้อมูลจาก Firestore
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
});
