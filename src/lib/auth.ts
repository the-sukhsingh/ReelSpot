import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "./db";
import User from "@/app/models/User";
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {

                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing Email or Password");
                }

                try {
                    
                    await connectToDb();

                    const user = await User.findOne({email: credentials.email})

                    if(!user){
                        throw new Error("User not found");
                    }

                    const isValid = await user.matchPassword(credentials.password);

                    if(!isValid){
                        throw new Error("Invalid Email or Password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                    }


                } catch (error) {

                    if(error instanceof Error){
                        throw new Error(error.message);
                    }else{
                        throw new Error("Something went wrong");
                    }

                }
                
            }
        })
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token.id = user.id;
            }
            return token;
        },
        async session({session, token}){

            if(session.user){
                session.user.id = token.id as string;
            }

            return session
        }
    },
    pages:{
        signIn: "/login",
        error: "/login"
    },
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET
}