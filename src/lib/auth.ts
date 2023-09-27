// import { NextAuthOptions } from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter} from '@next-auth/prisma-adapter';
// import { db } from "./db";
// import { compare } from "bcrypt";

// export const authOptions: NextAuthOptions = {
//     adapter: PrismaAdapter (db),
//     secret : process.env.NEXTAUTH_SECRET, 
//     session: {
//     strategy: 'jwt'
//     },
//     pages: {
//     signIn: '/auth/sign-in',
//     },
//     providers: [

//     CredentialsProvider({
//     name: "Credentials",
//     credentials: {
//     email: { label: "Email", type: "email", placeholder: "Santanu@omlogistics.co.in" },
//     password: { label: "Password", type: "password" }
//     },


//     async authorize(credentials){
//     if(!credentials?.email || !credentials?.password) {
//     return null;
//     }
//     const existingUser = await db.user.findUnique ({
//     where: { email: credentials?.email }
//     });
//     if (!existingUser) {
//     return null;
//     }
//     const passMatch = await compare(credentials.password,existingUser.password);
//     if(!passMatch){
//         return null;
//     }
//     return {
//         id: `${existingUser.id}`,
//         username: existingUser.username,
//         email: existingUser.email,
//         role:existingUser.role
//     }
//     }
// })
// ],
// callbacks:{
//     async jwt({token ,user}){
//         if(user){
//             return {
//                 ...token,
//                 username: user.username,
//                 role:user.role

//             }
//         }
//         return token;
//     },
//     async session({session,token}){
//         return {
//             ...session,
//             user :{
//                 ...session.user,
//                 username:token.username,
//                 role:token.role
//             }
//         }
//     },
// }
// }
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter} from '@next-auth/prisma-adapter';
import db  from "./db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter (db),
    secret : process.env.NEXTAUTH_SECRET, 
    session: {
    strategy: 'jwt'
    },
    pages: {
    signIn: '/auth/sign-in',
    },
    providers: [

    CredentialsProvider({
    name: "Credentials",
    credentials: {
    email: { label: "Email", type: "email", placeholder: "Santanu@omlogistics.co.in" },
    password: { label: "Password", type: "password" }
    },

    async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
      
        const userInUsersTable = await db.query('SELECT * FROM users WHERE email = $1', [credentials.email]);
        const userInDriversTable = await db.query('SELECT * FROM drivers WHERE email = $1', [credentials.email]);
      
        let userRole = null;
        let existingUser = null;
      
        if (userInUsersTable.rows.length > 0) {
          userRole = userInUsersTable.rows[0].role;
          existingUser = userInUsersTable.rows[0];
        } else if (userInDriversTable.rows.length > 0) {
          userRole = userInDriversTable.rows[0].role; 
          existingUser = userInDriversTable.rows[0]; 
        }
      
        if (!userRole) {
          return null; // User not found in either table
        }
      
        // ...
      console.log("=======================>",existingUser)
        return {
          id: `${existingUser.userid}`,
          username: existingUser.username,
          email: existingUser.email,
          role: userRole, // Assign the determined role to the user
        };
      },
})
],
callbacks:{
    async jwt({token ,user}){
        if(user){
            return {
                ...token,
                username: user.username,
                role:user.role

            }
        }
        return token;
    },
    async session({session,token}){
        return {
            ...session,
            user :{
                ...session.user,
                username:token.username,
                role:token.role
            }
        }
    },
}
}