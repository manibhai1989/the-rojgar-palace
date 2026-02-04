import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/auth/signin",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Hardcoded admin checking
                if (
                    credentials?.email === (process.env.ADMIN_EMAIL || "admin@therojgarpalace.in") &&
                    (credentials?.password === process.env.ADMIN_PASSWORD || credentials?.password === "admin123")
                ) {
                    try {
                        // Sync with database to ensure user exists for profile features
                        const user = await prisma.user.upsert({
                            where: { email: process.env.ADMIN_EMAIL || "admin@therojgarpalace.in" },
                            update: {},
                            create: {
                                email: process.env.ADMIN_EMAIL || "admin@therojgarpalace.in",
                                name: "Admin User",
                                image: "",
                            },
                        });

                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            image: user.image,
                        };
                    } catch (error) {
                        console.error("Error syncing admin user:", error);
                        // Fallback if DB fails (unlikely if connected)
                        return {
                            id: "1",
                            name: "Admin User",
                            email: process.env.ADMIN_EMAIL || "admin@therojgarpalace.in",
                        };
                    }
                }

                return null;
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token && session.user) {
                session.user.name = token.name;
                session.user.email = token.email;
                // session.user.id = token.id as string; // Ideally passing ID too
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    }
};
