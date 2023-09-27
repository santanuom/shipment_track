// import { NextResponse } from "next/server";
// import  db  from "@/lib/db";
// import { hash } from 'bcrypt';
// import * as z from 'zod';

import db from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";


// const userSchema = z
// .object({
//   username: z.string().min(1, 'Username is required').max(100),
//   email: z.string().min(1, 'Email is required').email('Invalid email'),
//   password: z
//     .string()
//     .min(1, 'Password is required')
//     .min(8, 'Password must have than 8 characters'),
//   role:z.string().min(1, 'Password is required')
// })


// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { email, username, password, role } = userSchema.parse(body);

//     // Check if email already exists
//     const existingUserByEmail = await db.user.findUnique({
//       where: { email: email }
//     });

//     if (existingUserByEmail) {
//       console.log("User with this email already exists");
//       return NextResponse.json({ user: null, message: "User with this email already exists" },{status:409});
//     }

//     // Check if username already exists
//     const existingUserByUsername = await db.user.findUnique({
//       where: { username: username }
//     });

//     if (existingUserByUsername) {
//       console.log("User with this username already exists");
//       return NextResponse.json({ user: null, message: "User with this username already exists" },{status:409});
//     }

//     const hashedPassword = await hash(password, 10);
//     const newUser = await db.user.create({
//       data: {
//         username,
//         email,
//         password: hashedPassword,
//         role
//       }
//     })

//     const {password :newUserPassword, ...rest }= newUser;
//     console.log("User Created Successfully!");
//     return NextResponse.json({ user: rest, message: "User Created Successfully!" }, { status: 201 });
//   } catch (error) {
//     console.error("An error occurred:", error);
//     return NextResponse.json({ user: null, message: "Internal server error" }, { status: 500 });
//   }
// }
export async function POST(req:any, res:any) {
  console.log(req)
  const payload = await req.json();
  let client; // Declare the client variable here

  try {
    // Start a database transaction
    client = await db.connect();
    await client.query('BEGIN');

    // Insert into the Users table
    const hashedPassword = await hash(payload.password, 10);
    if(payload.role !== 'driver'){
      const userQuery =
        "INSERT INTO users (username, email, password,role) VALUES ($1, $2, $3,$4) RETURNING userid";
      const userValues = [
        payload.username,
        payload.email,
        hashedPassword,
        payload.role
      ];
  
      const userResult = await client.query(userQuery, userValues);
      // const userId = userResult.rows[0].userid; // Get the generated userid
    }
    else if(payload.role === 'driver'){
      console.log(payload.role)
      const driverQuery =
        "INSERT INTO drivers (username, email, password,role,vehiclenumber,licensenumber,contactnumber) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING driverid";
      const driverValues = [
        payload.username,
        payload.email,
        hashedPassword,
        payload.role,
        payload.vehiclenumber,
        payload.licenceNo,
        payload.contactNo,
      ];
      const userResult = await client.query(driverQuery, driverValues);

    }
    // Insert into the Driver table

    // Commit the transaction if both inserts are successful
    await client.query('COMMIT');
    client.release();

    return NextResponse.json(
      { message: "User and Driver Registered Successfully." },
      { status: 201 }
    );
  } catch (error) {
    // Rollback the transaction on error
    if (client) {
      await client.query('ROLLBACK');
      client.release();
    }

    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while registering the user and driver." },
      { status: 500 }
    );
  }
}