import { AuthOptions } from 'next-auth'
import { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/db'
import { comparePassword } from '@/lib/password'
import { getServerSession } from 'next-auth'
declare module 'next-auth' {
    interface User {
        id: number
        email: string
        role: 'admin' | 'client' | 'consultant'
    }
    interface Session {
        user: User
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role: 'admin' | 'client' | 'consultant'
        id: number
    }
}

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                    select: {
                        id: true,
                        email: true,
                        password: true,
                        role: true
                    }
                })

                if (!user?.password || !user.role) {
                    return null
                }

                const isValid = await comparePassword(credentials.password, user.password)
                if (!isValid) {
                    return null
                }

                return {
                    id: parseInt(user.id.toString()),
                    email: user.email || '',
                    role: user.role as 'admin' | 'client' | 'consultant'
                } as User
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/signin'
    }
}

export const auth = getServerSession(authOptions)