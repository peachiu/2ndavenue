import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                remember: { label: "Remember Me", type: "boolean" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                try {
                    const [rows] = await pool.query(
                        'SELECT * FROM users WHERE email = ?',
                        [credentials.email]
                    );
                    const user = (rows as any[])[0];

                    if (!user || !user.password) {
                        throw new Error('No user found with this email');
                    }

                    const isPasswordMatch = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );

                    if (!isPasswordMatch) {
                        throw new Error('Incorrect password');
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        role: user.role
                    };
                } catch (error: any) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account }: any) {
            if (user) {
                if (account?.provider === "google") {
                    // For Google, fetch the internal DB ID
                    const [rows] = await pool.query(
                        'SELECT id, role FROM users WHERE email = ?',
                        [user.email]
                    );
                    const dbUser = (rows as any[])[0];
                    if (dbUser) {
                        token.id = dbUser.id.toString();
                        token.role = dbUser.role;
                    }
                } else {
                    // For Credentials, ID is already the DB ID (from authorize)
                    token.id = user.id;
                    token.role = user.role;
                }
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
            }
            return session;
        },
        async signIn({ user, account }: any) {
            if (account.provider === "google") {
                try {
                    const [rows] = await pool.query(
                        'SELECT * FROM users WHERE email = ?',
                        [user.email]
                    );
                    const existingUser = (rows as any[])[0];

                    if (!existingUser) {
                        // Create user in DB for the first time
                        await pool.query(
                            'INSERT INTO users (name, email, image, email_verified_at, role) VALUES (?, ?, ?, NOW(), ?)',
                            [user.name, user.email, user.image, 'community']
                        );
                    } else {
                        // Update image if it changed, and verify email
                        await pool.query(
                            'UPDATE users SET image = ?, email_verified_at = NOW() WHERE email = ?',
                            [user.image, user.email]
                        );
                    }
                    return true;
                } catch (error) {
                    console.error("Error saving Google user:", error);
                    return false;
                }
            }
            return true;
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt" as const,
    },
    secret: process.env.NEXTAUTH_SECRET,
    // trustHost needed when behind nginx reverse proxy
    trustHost: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
