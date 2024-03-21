import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/db";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ profile }) {
            if (!profile?.email || !profile?.name) {
                return "/login";
            }

            const user = await prisma.users.upsert({
                where: {
                    email: profile.email,
                },
                create: {
                    email: profile.email,
                    name: profile.name,
                    avatar: profile.image,
                    is_manager: false,
                },
                update: {
                    name: profile.name,
                    avatar: profile.image,
                }
            });

            return true;
        },
    },
    events: {
        async signIn({ user }) {
            const db_user = await prisma.users.findFirst({
                where: {
                    email: user.email as string,
                }
            });

            await prisma.login_Log.create({
                data: {
                    login: true,
                    user_id: db_user?.id as number,
                }
            });
        },
        async signOut({ session }) {
            const user = await prisma.users.findFirst({
                where: {
                    email: session?.user?.email as string,
                }
            });

            await prisma.login_Log.create({
                data: {
                    login: false,
                    user_id: user?.id as number,
                }
            });
        },
    },
}

const authHandler = NextAuth(authOptions);
export { authHandler as GET, authHandler as POST };
