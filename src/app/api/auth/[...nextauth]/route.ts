import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) {
                    return null
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })
                if(!user) {
                    return null
                }
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
                if(!isPasswordValid) {
                    return null
                }
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token.role = user.role
            }
            return token
        },
        async session({session, token}) {
            if(session.user) {
                session.user.role = token.role as "ADMIN" || "BORROWER"
            }
            return session
        },      
    },
    pages: {
        signIn: "/auth/signin"
    },
    session: {
        strategy: "jwt"
    }
})

export default handler