import {getServerSession} from "next-auth/next";
import {NextAuthOptions, User} from "next-auth";
import {AdapterUser} from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from "jsonwebtoken";
import {JWT} from "next-auth/jwt";
import {SessionInterface, UserProfile} from "@/common.types";
import {createUser, getUser} from "@/lib/actions";

const TAG: string = "##@@session.ts"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    jwt: {
        encode: ({secret, token}) => {
            console.log(`${TAG} secret: ${secret}  token: ${JSON.stringify(token)}`)//TODO: Remove this line before deployment.
            const encodedToken = jsonwebtoken.sign(
                {
                    ...token,
                    iss: "grafbase",
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                },
                secret
            );
            return encodedToken;
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret);
            return decodedToken as JWT;
        },
    },
    theme: {
        colorScheme: "light",
        logo: "/logo.svg",
    },
    callbacks: {
        async session({ session }) {
            const email = session?.user?.email as string;
            console.log(`${TAG} nextAuth wala defaultSession interface ke andar user ka email hai ${email}`)

            try {
                const data = await getUser(email) as { user?: UserProfile }
                console.log(`${TAG} us user ka data graphQL DB me dhoonda toh: data = ${JSON.stringify(data)}`)
                const newSession = {
                    ...session,
                    user: {
                        ...session.user,
                        ...data?.user,
                    },
                };
                return newSession;
            } catch (error: any) {
                console.log(`${TAG}  async session callback: ${error}`);
                return session;
            }
        },
        async signIn({user}: { user: AdapterUser | User }) {
            try {
                const userExists = await getUser(user?.email as string) as { user?: UserProfile }
                console.log(`${TAG} async signIn callback: userExists ki id: ${userExists.user?.id}`)
                if (!userExists.user) {
                    console.log(`${TAG} async signIn callback ke andar user does not pre-exists so creating new`)
                    await createUser(
                        user.name as string,
                        user.email as string,
                        user.image as string
                    );
                }
                console.log(`${TAG} async signIn callback ke andar signin successful`)
                return true;
            } catch (error: any) {
                console.log(`${TAG}  async signIn callback: ${error}`)
                alert(`signin failed: ${error}`);
                return false;
            }
        }
    }
};

export async function getCurrentUser() {
    const session = await getServerSession(authOptions) as SessionInterface;
    console.log(`${TAG}  session: ${session} ; user: ${session?.user}  ; ${session?.user?.email}, ${session?.user?.id}`)
    return session;
}