import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/db'; // Import your Prisma client

export const authOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 1 day
    },
    secret: process.env.NEXTAUTH_SECRET, // Use environment variable for secret
    pages: {
        signIn: '/signin',
        signOut: '/logout'
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            type: 'credentials',
            // @ts-ignore
            async authorize(credentials) {
                // Find user by email
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials?.email,
                    },
                });

                if (!user) {
                    return null;
                }
                // @ts-ignore
                if (user?.password !== credentials?.password) {
                    return null;
                }
                return user;
            },
        }),
    ],
    // Custom error handling in callbacks
    callbacks: {
        async jwt({token, user}:{token:any,user:any}): Promise<any> {
            if(user){
                token.user = user
            }
            return token
        },
        async session({session,token}:{session:any,user:any,token:any}): Promise<any>{
            if (token) {
                session.user = token.user
            }
            return session
        },
        async signIn({ user }:any): Promise<boolean>
        {
            return user;

        },
        async redirect(): Promise<string> {
            return Promise.resolve('/');
        }
    }

};
// @ts-ignore
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST}
