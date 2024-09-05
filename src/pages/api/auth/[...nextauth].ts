import prismaClient from '@gdrmusic/db/prismaClient';
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialProvider from "next-auth/providers/credentials"
import bcrypt from 'bcrypt'

export interface UserSession {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  accountMethod: string;
  userId: string;
}

export interface Session {
  user: UserSession;
  expires: string;
}

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/account/login'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET_ID as string
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials, req): Promise<any> => {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
        if (!emailRegex.test(email)) {
          throw new Error("Formato de email inválido!")
        }
        const user = await prismaClient.user.findUnique({
          where: {
            email
          }
        });
        if (!user) {
          throw new Error("E-mail não encontrado ou senha inválida!")
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("E-mail não encontrado ou senha inválida!")
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          imageUrl: user.imageUrl,
          accountMethod: user.accountMethod,
          userId: user.userId
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    signIn: async (user) => {
      const { email } = user.user;
      const userExists = await prismaClient.user.findUnique({
        where: {
          email: email as string
        }
      });
      if (!userExists) {
        const newUser = await prismaClient.user.create({
          data: {
            email: email as string,
            password: '',
            accountMethod: 'GOOGLE',
            name: user.user.name as string,
            imageUrl: user.user.image as string,
            userId: user.user.id as string
          }
        });
        await prismaClient.playlist.create({
          data: {
            title: 'Musicas Curtidas',
            type: 'PRIVATE',
            description: 'Musicas que você curtiu',
            thumbnail: '/images/liked.png',
            userId: newUser.id,
            createdBy: 'SYSTEM'
          }
        })
      }
      return true;
    },
    session: async ({ session, user }) => {
      if (!session.user) {
        return session
      }
      const { user: { email } } = session as Session;
      const userExists = await prismaClient.user.findUnique({
        where: {
          email: email as string
        }
      });
      if (userExists) {
        return {
          ...session,
          user: {
            ...session.user,
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
            imageUrl: userExists.imageUrl,
            accountMethod: userExists.accountMethod,
            userId: userExists.userId
          }
        }
      }
      return session;
    }
  }
}

export default NextAuth(authOptions)