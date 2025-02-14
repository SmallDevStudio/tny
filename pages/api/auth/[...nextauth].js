import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmail } from "@/services/firebase";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", required: true },
                password: { label: "Password", type: "password", required: true }
            },
            async authorize(credentials) {
                try {
                    const userCredential = await signInWithEmail(credentials.email, credentials.password);
                    if (!userCredential) throw new Error("Invalid credentials");

                    const user = userCredential.user;
                    return { id: user.uid, email: user.email, name: user.displayName || "" };
                } catch (error) {
                    throw new Error(error.message || "Invalid credentials");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        })
    ],
    pages: {
        signIn: "/signin",
        error: "/error",
        signOut: "/",
        signup: "/register"
    },
    callbacks: {
        async signIn({ user, account }) {
            const userId = user.id || user.uid;
            if (!userId) {
                throw new Error("User ID is missing");
            }

            const userRef = doc(db, "users", userId);
            const userProviderRef = doc(db, "userProviders", userId);
            const userDoc = await getDoc(userRef);

            const lastSignIn = {
                provider: account.provider,
                signInAt: new Date().toISOString()
            };

            if (userDoc.exists()) {
                await updateDoc(userRef, { lastSignin: lastSignIn });
                await updateDoc(userProviderRef, { provider: account.provider, lastSignin: lastSignIn.signInAt });
            } else {
                await setDoc(userRef, {
                    name: user.name || "",
                    email: user.email,
                    googleId: account.provider === "google" ? userId : null,
                    lineId: null,
                    address: "",
                    phone: "",
                    role: "user",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastSignin: lastSignIn
                });

                await setDoc(userProviderRef, {
                    userId: userId,
                    provider: account.provider,
                    createdAt: new Date().toISOString()
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
                    token.user = {...userDoc.data(), id: token.id, account: token.account};
                }
            } catch (error) {
                console.error("JWT update error:", error);
            }
            
            if (trigger === "update" && user) {
                try {
                    const userRef = doc(db, "users", token.id);
                    const userDoc = await getDoc(userRef);
        
                    if (userDoc.exists()) {
                        token.user = {...userDoc.data(), id: token.id, account: token.account};
                    }
                } catch (error) {
                    console.error("JWT update error:", error);
                }
            }
            
            return token;
        },
        async session({ session, token }) {
            session.user = token.user;
            session.account = token.account;

            return session;
        },
        async redirect({ url, baseUrl }) {
            return baseUrl;
        }
    },
    session: {
        strategy: "jwt"
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET
    },
    secret: process.env.NEXTAUTH_SECRET
});
